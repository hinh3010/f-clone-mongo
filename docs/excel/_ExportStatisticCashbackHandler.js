const { getModel } = require("../connections/database")
const { ExportAction } = require("./_ExportAction")
const UploadService = require('../services/Uploader')
const path = require('path')
const moment = require('moment')
const fs = require('fs');
const { getSimpleLogger } = require("@pf126/parrot")
const delay = require('../helpers/delay')
const mongoose = require("mongoose")
const Excel = require('exceljs');

const DIRECTORY = 'cashback_statistics' 
const SUMMARY = 'Summary'
const CASHBACK_STATISTICS = 'cashback_manager'
const CASHBACK_UPLOAD = 'cashback_upload'
const Logger = getSimpleLogger()
const FORMAT_DATE = 'MMDDYYYY-HHmm'
const TAG = 'CASHBACK'
const MAX_RETRY_STATISTIC_CASHBACK_DETAIL = 2
const MAX_RETRY_UPLOAD_FILE_STATISTIC_CASHBACK = 2

const _onlyUnique = (value, index, self) => self.indexOf(value) === index
const _logJson = (object) => JSON.stringify(object, null, 4)

/**
 * @typedef {Object} CalculationJob
 * 
 * @property {string} _id - ID of Calculation Job
 * @property {Object} store - Store information related to Calculation Job
 * @property {string} store.slug - Slug of store
 * @property {string} store.domain - Domain of store
 * @property {string[]} cashback_rule_ids - Array of IDs of Cashback Rules related to Calculation Job
 * @property {Object} parent_id - Information about the current Calculation Job parent of the current Calculation Job
 * @property {string} parent_id._id - ID of Calculation Job parent
 * @property {Date} parent_id.created_at - Time to create Calculation Job parent
 */


/**
 * @typedef {Object} BodySummarySheetItem
 * 
 * @property {string} store - Slug of store
 * @property {string} storeUrl - Domain of store
 * @property {number} cashback
 * @property {Array<string>} cashbackRuleTypes
 */


/**
 * @param {Date} date 
 * @returns 
 */
const _formatDate = (date) => {
    return moment(date).format(FORMAT_DATE)
}

/**
 * 
 * @param {string} name 
 * @param {'xlsx'|'csv'} mimetype 
 * @returns 
 */
const _getFilePath = (name, mimetype = 'xlsx') => {
    const fileName = `${name}.${mimetype}`
    const filePath = path.join(__dirname, `/upload_cashback/${fileName}`)

    return filePath
}

/**
 * get header
 * @param {'csv_seller'|'excel_summary'|'excel_store'|'csv_system'} type 
 * @returns {Array<string>|Array<{header:string,key:string,width:number}>}
 */
const _getHeader = (type) => {
    const headerCsvForSeller = ['Store', 'Order Number', 'Created Date', 'Buyer Paid At', 'Seller Paid At', 'Product Type', 'Cashback Type', 'Quantity', 'Cashback']
   
    const headerCsvUploadSystem = ['store_id', 'value', 'link_detail']

    const headerExcelSummary = [
        { header: 'Store', key: 'store', width: 10 },
        { header: 'Store URL', key: 'storeUrl', width: 50 },
        { header: 'Cashback', key: 'cashback', width: 20 },
        { header: 'Cashback Type', key: 'cashbackRuleTypes', width: 20 },
    ]

    const headerExcelStore = [
        { header: 'Store', key: 'store', width: 20 },
        { header: 'Order number', key: 'orderNumber', width: 20 },
        { header: 'Created Date', key: 'orderCreated', width: 20 },
        { header: 'Buyer Paid At', key: 'buyerPaidAt', width: 20 },
        { header: 'Seller Paid At', key: 'sellerPaidAt', width: 20 },
        { header: 'Product Type', key: 'productType', width: 20 },
        { header: 'Cashback Type', key: 'cashbackTypes', width: 20 },
        { header: 'Quantity', key: 'quantity', width: 20 },
        { header: 'Cashback', key: 'cashback', width: 20 },
        { header: 'Shipping Cost', key: 'shippingCost', width: 20 },
        { header: 'Base Price', key: 'basePrice', width: 20 },
        { header: 'Fulfillment Cost', key: 'fulfillmentCost', width: 20 },
        { header: 'Two Sided Cost', key: 'twoSidedCost', width: 20 },
        { header: 'Discount Amount', key: 'discountAmount', width: 20 },
        { header: 'Supplier', key: 'supplier', width: 20 },
        { header: 'Country Code', key: 'countryCode', width: 20 }
    ]

    if (type === 'csv_seller') return headerCsvForSeller

    if (type === 'excel_summary') return headerExcelSummary

    if (type === 'excel_store') return headerExcelStore

    if (type === 'csv_system') return headerCsvUploadSystem
}

/**
 * make file csv for seller upload to system
 * @param {any[]} body
 */
const _createCsvForManager = async (body, parentTime) => {
    try {
        const exportAction = new ExportAction()

        const filePath = _getFilePath(CASHBACK_UPLOAD + parentTime, 'csv')

        const header = _getHeader('csv_system')

        // make file csv
        const workbook = await exportAction.exportCsv(header, body)
        await workbook.csv.writeFile(filePath)
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * make file excel for seller
 * @param {Array<BodySummarySheetItem>} body
 * @param {string} parentTime
 */
const _upsertSheetSummary = async (body, parentTime) => {
    try {
        const exportAction = new ExportAction()

        const filePath = _getFilePath(CASHBACK_STATISTICS + parentTime)

        const header = _getHeader('excel_summary')

        // check if file exists
        const isSummarySheet = await exportAction.sheetExists(filePath, SUMMARY)

        // create a new summary sheet || update a new row in summary sheet
        if (!isSummarySheet) {
            await exportAction.createExcel({
                filePath,
                sheetName: SUMMARY,
                body: body,
                header: header
            })
        } else {
            await exportAction.updateExcel({
                filePath,
                sheetName: SUMMARY,
                body: body,
                header: header
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}


/**
 * Total cashback statistics by calculation_job_id in collections CashbackCalculationDetail
 * @param {ObjectId} jodId 
 * @returns {Promise<CalculationJob>}
 */
const _getCalculationJob = async (jodId) => {
    const Store = getModel('Store')
    const CashbackCalculationJob = getModel('CashbackCalculationJob')
    const CashbackCalculationHistory = getModel('CashbackCalculationHistory')
    const CashbackRule = getModel('CashbackRule')

    const calculationJob = await CashbackCalculationJob.findById(jodId)
        .populate([
            {
                path: 'store',
                select: 'slug domain',
                model: Store
            },
            {
                path: 'parent_id',
                select: 'created_at',
                model: CashbackCalculationHistory
            },
            {
                path: 'cashback_rule_ids',
                select: 'cashback_type',
                model: CashbackRule
            }
        ])
        .lean()
    return calculationJob
}

/**
 * Total cashback statistics by calculation_job_id in collections CashbackCalculationDetail
 * @param {ObjectId} jodId 
 * @returns {Promise<number>}
 */
const _getTotalCashback = async (jodId) => {
    const CashbackCalculationDetail = getModel('CashbackCalculationDetail')
    const statisticTotalCashback = await CashbackCalculationDetail.aggregate([
        {
            $match: {
                calculation_job_id: mongoose.Types.ObjectId(jodId)
            }
        },
        {
            $group: {
                _id: null,
                totalCashback: { $sum: "$cashback" }
            }
        },
    ]).allowDiskUse(true)
    const { totalCashback } = statisticTotalCashback[0]
    return totalCashback
}

/**
 * get and format Cashback rules
 * @param {Array<{_id: ObjectId,cashback_type:string}>} cashback_rules 
 * @returns {Array<string>}
 */
const _getCashbackRuleType = (cashback_rules) => {
    const cashbackRuleTypes = []

    cashback_rules.forEach(rule => {
        cashbackRuleTypes.push(rule.cashback_type)
    })

    const cashbackRuleTypeUnique = cashbackRuleTypes.filter(_onlyUnique).join(', ')
    return cashbackRuleTypeUnique
}

/**
 * Process detailed Cashback statistics for a given Calculation Job.
 *
 * @param {ObjectId} cashbackCalculationJobId - ID of Calculation Job need statistics.
 * @returns {Promise<{cashback_detail_file_url:string,total_cashback:number}>}
 * @throws {Error} If Calculation Job does not exist or is not eligible for statistics.
 */
const _handlerStatisticCashbackDetail = async (cashbackCalculationJobId) => {
    /** @type {CalculationJob}*/
    const calculationJob = await _getCalculationJob(cashbackCalculationJobId)
    
    // check Cashback Calculation Job
    if (!calculationJob) throw new Error('Cashback Calculation Job not found')

    const { store, cashback_rule_ids: cashback_rules, parent_id: parent } = calculationJob

    if (!store || !cashback_rules?.length || !parent) throw new Error('Data rendering condition is not satisfied')

    // timer
    const parentTime = _formatDate(new Date(parent.created_at))

    // get totalCashback
    const totalCashback = await _getTotalCashback(cashbackCalculationJobId)

    const cashbackRuleTypes = _getCashbackRuleType(cashback_rules)

    // add statistics to the sheet summary
    const bodySummary = [
        {
            store: store.slug,
            storeUrl: store.domain,
            cashback: totalCashback,
            cashbackRuleTypes
        }
    ]

    // summary sheet
    await _upsertSheetSummary(bodySummary, parentTime)

    const fileUrl = await recursiveCalculation(cashbackCalculationJobId, parentTime, store, cashbackRuleTypes)

    // create file csv for seller upload to system
    const bodyCsv = [{ store_id: store.slug, value: totalCashback, link_detail: fileUrl }]
    await _createCsvForManager(bodyCsv, parentTime)

    return {
        cashback_detail_file_url: fileUrl,
        total_cashback: totalCashback
    }
}

const recursiveCalculationAddRow = async (worksheet, csv, store, cashbackCalculationJobId, cashbackRuleTypeUnique, lastTime = null) => {
    const CashbackCalculationDetail = getModel('CashbackCalculationDetail')
    // get list cashback details
    const query = {
        calculation_job_id: cashbackCalculationJobId
    }
    if (lastTime) query.created_at = { $gt: lastTime }
    const listCashbackDetails = await CashbackCalculationDetail.find(query).limit(10).lean()

    if (!listCashbackDetails.length) return

    listCashbackDetails.forEach(detail => {
        const commonData = {
            store: store.slug,
            orderNumber: detail.order_number,
            // moment.utc(date).utcOffset('+07:00').format('MM/DD/YYYY HH:mm:ss'),
            orderCreated: moment(detail.order_created_date).format('MM/DD/YYYY HH:mm:ss'),
            buyerPaidAt: moment(detail.buyer_paid_at).format('MM/DD/YYYY HH:mm:ss'),
            sellerPaidAt: moment(detail.seller_paid_at).format('MM/DD/YYYY HH:mm:ss'),
            productType: detail.type,
            cashbackTypes: cashbackRuleTypeUnique
        }

        worksheet.addRow({
            ...commonData,
            quantity: detail.quantity,
            cashback: detail.cashback,
            shippingCost: detail.shipping_cost,
            basePrice: detail.base_price,
            fulfillmentCost: detail.fulfillment_cost,
            twoSidedCost: detail.two_sided_cost,
            discountAmount: detail.discount_amount,
            supplier: detail.supplier,
            countryCode: detail.country_code,
        });

        csv.addRow(Object.values({
            ...commonData,
            quantity: detail.quantity,
            cashback: detail.cashback
        }));
    })

    return recursiveCalculationAddRow(worksheet, csv, store, cashbackCalculationJobId, cashbackRuleTypeUnique, lastTime = listCashbackDetails[listCashbackDetails.length-1].created_at)
}

const recursiveCalculation = async (cashbackCalculationJobId, parentTime, store, cashbackRuleTypeUnique) => {
    const workbook = new Excel.Workbook();

    const filePath = _getFilePath(CASHBACK_STATISTICS + parentTime)

    // read file
    await workbook.xlsx.readFile(filePath)

    // check if sheet exists
    const currSheet = workbook.getWorksheet(store.slug)
    if (currSheet) {
        // delete sheet
        workbook.removeWorksheet(currSheet.id)
    }

    // add new sheet store
    const worksheet = workbook.addWorksheet(store.slug)

    worksheet.columns = _getHeader('excel_store')
    const header = worksheet.getRow(1)
    header.alignment = this._alignmentHeader
    header.fill = this._fillHeader
    header.border = this._borderHeader
    header.height = 20

    // add csv for seller
    const csvBook = new Excel.Workbook();
    const csv = csvBook.addWorksheet(store.slug);
    csv.addRow(_getHeader('csv_seller'))

    await recursiveCalculationAddRow(worksheet, csv, store, cashbackCalculationJobId, cashbackRuleTypeUnique)

    // write file
    await workbook.xlsx.writeFile(filePath)

    // Write the workbook to a buffer;
    const buffer = await csvBook.csv.writeBuffer()

    // upload to s3x
    const { data, error } = await UploadService.uploadBuffer({
        buffer,
        directory: DIRECTORY,
        filename: `CB-${_formatDate(Date.now())}-${store.slug}.csv`,
        mimetype: 'text/csv'
    })

    if (error || !data) {
        throw new Error(error)
    }

    // upload csv for seller to s3 and get the link download
    const fileUrl = data.Location
    if (!fileUrl) throw new Error('Upload file statistic failed')

    return fileUrl
}

/**
 *  Uploads a buffer containing file data to a specified directory in a cloud storage service.
 * 
 * @param {object} file 
 * @param {CASHBACK_UPLOAD|CASHBACK_STATISTICS|string} file.name
 * @param {'csv'|'xlsx'} file.type 
 * @param {string} file.time 
 * @param {'text/csv'|undefined} mimetype 
s */
const _UploadS3WithStream = async (file, mimetype) => {
    const fileName = file.name + file.time
    const filePath = _getFilePath(fileName, file.type)

    if (!fs.existsSync(filePath)) throw new Error('Could not find file ' + fileName)
    
    const readStream = fs.createReadStream(filePath);

    // upload to s3
    const { data, error } = await UploadService.uploadBuffer({
        directory: DIRECTORY,
        filename: `${file.name}-CB-${_formatDate(Date.now())}.${file.type}`,
        mimetype: mimetype || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: readStream
    }, { useStream: true })

    if (error || !data) throw new Error(error)

    return data || {}
}

/**
 * Handle upload file cashback to s3 and return url
 * 
 * @param {ObjectId} calculationId 
 * @param {number|undefined} retry 
 * @returns {Promise<{total_cashback_file_url: string,summary_file_url:string}|any>}
 */
const _handlerUploadCashbackForSeller = async (calculationId, retry = 0) => {
    if (retry) Logger.info(`${[TAG]} Calculation History: ${calculationId} run retry | nthTry ${retry}`)

    const CashbackCalculationHistory = getModel('CashbackCalculationHistory')
    const calculationHistory = await CashbackCalculationHistory.findById(calculationId).lean()

    if (!calculationHistory) {
        return false
    }

    // timer
    const parentTime = _formatDate(new Date(calculationHistory.created_at))

    try {
        const [{ Location: total_cashback_file_url }, { Location: summary_file_url }] = await Promise.all([
            _UploadS3WithStream({ name: CASHBACK_UPLOAD, type: 'csv', time: parentTime }, 'text/csv'),
            _UploadS3WithStream({ name: CASHBACK_STATISTICS, type: 'xlsx', time: parentTime })
        ])
        return {
            total_cashback_file_url,
            summary_file_url
        }
    } catch (error) {
        if (retry < MAX_RETRY_UPLOAD_FILE_STATISTIC_CASHBACK) {
            const newRetry = retry + 1;
            await delay(newRetry * 5000) // wait 5s * number of retry  before retry
            return _handlerUploadCashbackForSeller(calculationId, newRetry)
        }
        // capture the sentry before throwing exception
        throw new Error(error)
    }
}

function withRetry(fn, maxRetries = 3, delay = 5000) {
    return function (...args) {
        let retries = 0;
        function attempt() {
            return fn(...args).catch(error => {
                if (retries < maxRetries) {
                    console.log('\n\n')
                    Logger.info(`Error::: '${error.message}'. Argument::: '${args}'`);
                    Logger.info(`Attempt ${retries} failed. Retrying in ${delay}ms...`);
                    console.log('\n\n')
                    retries++;
                    return new Promise(resolve => setTimeout(resolve, delay)).then(attempt);
                }
                throw new Error(error);
            });
        }
        return attempt();
    }
}

exports.handlerStatisticCashbackDetail = withRetry(_handlerStatisticCashbackDetail)
exports.handlerUploadCashbackForSeller = withRetry(_handlerUploadCashbackForSeller)
