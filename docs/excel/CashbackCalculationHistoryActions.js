/**
 *
 * @typedef {Object} PayloadSearch
 *
 * @property {('pending'|'processing'|'done'|'failed'|'cancelled')} payload.status
 * @property {number} payload.limit
 * @property {string} payload.id
 * @property {number} payload.page
 * @property {string} payload.from
 * @property {string} payload.to
 * @property {(1|-1)} params.sort
 */

const { getModel } = require('../connections/database')
const postman = require('../connections/postman')
const moment = require('moment')
const ExportStatisticCashbackHandler = require('./_ExportStatisticCashbackHandler');

const CashbackCalculationJobActions = require('./CashbackCalculationJobActions')

const CashbackCalculationHistory = getModel('CashbackCalculationHistory')
const CashbackCalculationJob = getModel('CashbackCalculationJob')
const CashbackRule = getModel('CashbackRule')
const Joi = require('joi')
const ObjectId = require('mongoose').Types.ObjectId

/**
 * format time from dd/mm/yyyy to yyyy/mm/dd
 * @param {string} dateTime time to client-side format dd/mm/yyyy
 * @param {string} type - time pattern enum type ['start', 'end']
 * @returns {Date}
 */
const _formatDate = (dateTime, type) => {
    const timeZone = (new Date().getTimezoneOffset() / 60) * (-1);
    const newDate = new Date(moment(dateTime, 'MM-DD-YYYY').format('YYYY-MM-DD'))
    newDate.setHours(newDate.getHours() + timeZone);

    if (type === 'start') {
        return new Date(moment(newDate).startOf('day').valueOf())
    }
    if (type === 'end') {
        return new Date(moment(newDate).endOf('day').valueOf())
    }
    return new Date(moment(newDate).valueOf())
}

const emailRegex = /@foobla\.com$/i;

const STATUS_TYPES = ['pending', 'processing', 'done', 'failed', 'cancelled']

/**
 * validate query before find database
 * @param {PayloadSearch} payload
 * @returns {payload|error}
 */
const _validateBeforeSearch = payload => {
    const schema = Joi.object({
        status: Joi.string().trim().valid(...STATUS_TYPES).allow(''),
        id: Joi.string().trim().allow(''),
        email: Joi.string().trim().allow('').pattern(emailRegex),
        limit: Joi.number().default(10).min(1),
        page: Joi.number().default(1).min(1),
        from: Joi.string().allow(''),
        to: Joi.string().allow(''),
        sort: Joi.number().valid(1, -1).default(1)
    })

    const { error, value } = schema.validate(payload)
    if (error) {
        throw new Error(error.message || error)
    }
    return value
}

/**
 * validate query before update database
 * @param {object} payload
 * @param {ObjectId} payload.cashbackId - id of docs in collection cashback history
 * @returns {payload|error}
 */
const _validateBeforeUpdate = payload => {
    const schema = Joi.object({
        cashbackId: Joi.string().trim().required().custom((value, helpers) => {
            if (ObjectId.isValid(value)) {
                return value
            }
            return helpers.message('This cashback history not found')
        }),
    })

    const { error, value } = schema.validate(payload)
    if (error) {
        throw new Error(error.message || error)
    }
    return value
}

const IGNORE_PROCESSING_STATUSES = ['cancelled', 'processing', 'done']

/**
 * Get all active rules have apply time in the last month
 */
const _getActiveRulesGroupedByStore = async () => {
    const calculateStartTime = moment().subtract(1, 'month').startOf('month')
    const calculateEndTime = calculateStartTime.clone().endOf('month')

    const ruleQuery = {
        status: 'active',
        $or: [
            {
                apply_time_from: { $lte: calculateEndTime.toDate() },
                apply_time_to: { $gte: calculateStartTime.toDate() }
            },
            {
                apply_time_from: { $gte: calculateStartTime.toDate(), $lte: calculateEndTime.toDate() },
                apply_time_to: { $gte: calculateEndTime.toDate() }
            },
            {
                apply_time_from: { $lte: calculateStartTime.toDate() },
                apply_time_to: { $gte: calculateStartTime.toDate(), $lte: calculateEndTime.toDate() }
            }
        ]
    }

    return CashbackRule.aggregate([
        {
            $match: ruleQuery
        },
        {
            $group: {
                _id: '$store',
                rules: { $push: '$_id' }
            }
        }
    ])
}


/**
 * Create cashback calculation history
 * @param args
 * @param {String} args.calculation_id
 * @param {String} args.created_by
 */
exports.createCashbackCalculationHistory = async (args) => {
    const hasPendingOrRunningHistory = await CashbackCalculationHistory.exists({
        status: {$in: ['pending', 'processing']}
    })

    if (hasPendingOrRunningHistory) {
        throw new Error('There is a pending or running calculation job')
    }

    const {calculation_id, created_by} = args // calculation_id: CB-20230529-1327
    const newJob = new CashbackCalculationHistory({calculation_id, created_by})
    const savedJob = (await newJob.save()).toObject()

    // find active rules --> create cashback calculation job for each rule with parent id
    const activeRulesGroupedByStore = await _getActiveRulesGroupedByStore()
    const calculationJobs = activeRulesGroupedByStore.map(({ _id: store, rules }) => {
        return {
            store,
            parent_id: savedJob._id,
            cashback_rule_ids: rules
        }
    })

    await CashbackCalculationJob.insertMany(calculationJobs)

    // publish message to process calculation - by parent id
    await postman.publish('CALCULATE_CASHBACK', {parent_id: savedJob._id})

    return true
}

exports.calculateCashbackHistory = async (calculationId) => {
    if (!calculationId) {
        console.error(`[CALCULATE_CASHBACK] Invalid calculation id ${calculationId}`)
    }

    const calculationHistory = await CashbackCalculationHistory.findById(calculationId).lean()
    if (!calculationHistory) {
        console.error(`[CALCULATE_CASHBACK] Calculation history not found ${calculationId}`)

        return false
    }

    if (IGNORE_PROCESSING_STATUSES.includes(calculationHistory.status)) {
        console.error(`[CALCULATE_CASHBACK] Cannot process calculation history ${calculationId} with status ${calculationHistory.status}`)

        return false
    }

    // update status to processing
    await CashbackCalculationHistory.updateOne({_id: calculationId}, {status: 'processing'})
    console.log(`[CALCULATE_CASHBACK] Start calculate cashback history: ${calculationId}`)

    getModel('Store')
    const calculationJobs = await CashbackCalculationJob
        .find({
            parent_id: calculationId,
            status: 'pending'
        })
        .select('store cashback_rule_ids')
        .populate({ path: 'store', select: 'slug' })
        .lean()

    if (!calculationJobs.length) {
        console.log(`[CALCULATE_CASHBACK] No pending calculation jobs found ${calculationId}`)

        return false
    }

    for (const calculationJob of calculationJobs) {
        const {_id} = calculationJob
        await CashbackCalculationJobActions.calculateCashback(_id)
    }

    const completedCalculationJobs = await CashbackCalculationJob.count({
        parent_id: calculationId,
        status: 'done'
    })

    const update = {
        status: completedCalculationJobs === calculationJobs.length ? 'done' : 'failed'
    }

    console.log('\n\n\n')
    console.log(`[CALCULATE_CASHBACK_UPLOAD_S3_START] Calculate cashback history: ${calculationId}`)
    console.time('[CALCULATE_CASHBACK_UPLOAD_S3_TOTAL_TIME]')
    try {
        // upload file to s3 and return url
        const { total_cashback_file_url, summary_file_url } = await ExportStatisticCashbackHandler.handlerUploadCashbackForSeller(calculationId)
        
        update.total_cashback_file_url = total_cashback_file_url
        update.summary_file_url = summary_file_url
    } catch (error) {
        console.log(`[CALCULATE_CASHBACK] Failed calculate cashback history: ${calculationId}: ${error.message}`)
        update.status = 'failed'
    }
    console.timeEnd('[CALCULATE_CASHBACK_UPLOAD_S3_TOTAL_TIME]')
    console.log(`[CALCULATE_CASHBACK_UPLOAD_S3_END]`)
    console.log({ update })
    console.log('\n\n\n')

    await CashbackCalculationHistory.updateOne({_id: calculationId}, update)

    console.log(`[CALCULATE_CASHBACK] Finish calculate cashback history: ${calculationId}`)
    return true
}

/**
 * Fetch cashback history
 * @param {PayloadSearch} payload
 */
exports.searchCashbackCalculationHistory = async (payload) => {
    const { page, limit, sort, from, to, status, id: calculation_id, email } = _validateBeforeSearch(payload)

    const skip = limit * (page - 1)
    const query = {}
    const created_at = {}

    // format and validate when query by created at
    const parsedFrom = (from) ? _formatDate(from, 'start') : null
    const parsedTo = (to) ? _formatDate(to, 'end') : null
    if (parsedFrom) created_at['$gte'] = parsedFrom
    if (parsedTo) created_at['$lte'] = parsedTo

    if (Object.keys(created_at).length) query.created_at = created_at

    if (status) query.status = status
    if (calculation_id) query.calculation_id = calculation_id

    const Account = getModel('Account')


    if (email) {
        const accounts = await Account.find({ email }).select('_id').lean()
        const accountIds = accounts.map(account => account._id)
        query.created_by = { $in: accountIds }
    }

    const [totalCashback, histories] = await Promise.all([
        CashbackCalculationHistory.countDocuments(query),
        CashbackCalculationHistory.find(query).sort({ created_at: sort }).limit(limit).skip(skip).lean().populate({
            path: 'created_by',
            select: 'email name',
        })
    ])

    const totalPages = Math.ceil(totalCashback / limit) || 0

    return { histories, totalCashback, page, totalPages, limit }
}


/**
 * retry cashback
 * @param {object} payload
 */
exports.retryCashbackCalculationHistory = async (payload) => {
    const { cashbackId } = _validateBeforeUpdate(payload)

    const cashback = await CashbackCalculationHistory.findOneAndUpdate(
        {
            _id: cashbackId,
            status: { $ne : 'pending' }
        },
        {
            status : 'pending',
        }
    )

    if (!cashback) throw new Error('Cashback history not found')
    return cashback
}

/**
 * cancel cashback
 * @param {object} payload
 */
exports.cancelCashbackCalculationHistory = async (payload) => {
    const { cashbackId } = _validateBeforeUpdate(payload)

    const cashback = await CashbackCalculationHistory.findOneAndUpdate(
        {
            _id: cashbackId,
            status:'pending'
        },
        {
            status: 'cancelled',
        }
    )

    if (!cashback) throw new Error('Cashback history not found')
    return cashback
}
