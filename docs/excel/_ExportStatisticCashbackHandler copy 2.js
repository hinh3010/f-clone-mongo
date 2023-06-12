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
const FORMAT_DATE = 'DDMMYYYY-HHmm'
const TAG = 'CASHBACK'
const MAX_RETRY_STATISTIC_CASHBACK_DETAIL = 2
const MAX_RETRY_UPLOAD_FILE_STATISTIC_CASHBACK = 2


const _onlyUnique = (value, index, self) => self.indexOf(value) === index

/**
 * @param {Date} date 
 * @returns 
 */
const _formatDate = (date) => {
    return moment(date).format(FORMAT_DATE)
}

/**
 * 
 * @param {object[]} listCashbackDetails 
 * @param {object} store 
 * @param {string} store.slug
 * @returns 
 */
const _formatPayload = (listCashbackDetails, store, cashbackTypes) =>{
    // format data
    let totalCashback = 0
    const bodyStore = []
    const bodyCsvForSeller = []

    listCashbackDetails.forEach(detail => {
        totalCashback += detail.cashback

        const commonData = {
            store: store.slug,
            orderNumber: detail.order_number,
            orderCreated: detail.order_created_date,
            buyerPaidAt: detail.buyer_paid_at,
            sellerPaidAt: detail.seller_paid_at,
            productType: detail.type,
            cashbackTypes
        }

        bodyStore.push({
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
        })

        bodyCsvForSeller.push({
            ...commonData,
            quantity: detail.quantity,
            cashback: detail.cashback
        })
    })

    return  {
        totalCashback,
        bodyStore,
        bodyCsvForSeller
    }
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
 * @returns 
 */
const _getHeader = (type) => {
    const headerCsvForSeller = ['Store', 'Order Number', 'Created Date', 'Buyer Paid At', 'Seller Paid At', 'Product Type', 'Cashback Type', 'Quantity', 'Cashback']
   
    const headerCsvUploadSystem = ['store_id', 'value', 'link_detail']

    const headerSummary = [
        { header: 'Store', key: 'store', width: 10 },
        { header: 'Store URL', key: 'storeUrl', width: 50 },
        { header: 'Cashback', key: 'cashback', width: 20 },
        { header: 'Cashback Type', key: 'cashbackRuleTypes', width: 20 },
    ]

    const headerStore = [
        { header: 'Store', key: 'store', width: 20 },
        { header: 'Order number', key: 'orderNumber', width: 20 },
        { header: 'Created Date', key: 'orderCreated', width: 20 },
        { header: 'Buyer Paid At', key: 'buyerPaidAt', width: 20 },
        { header: 'Seller Paid At', key: 'sellerPaidAt', width: 20 },
        { header: 'Product Type', key: 'productType', width: 20 },
        { header: 'Cashback Type', key: 'cashbackTypes', width: 20 },
        // { header: 'Variant Title', key: 'variantTitle', width: 20 },
        // { header: 'Variant Fulfill', key: 'variantFulfill', width: 20 },
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

    if (type === 'excel_summary') return headerSummary

    if (type === 'excel_store') return headerStore

    if (type === 'csv_system') return headerCsvUploadSystem
}

const _logJson = (object) => JSON.stringify(object, null, 4)

/**
 * make file csv and upload to s3
 * @param {any[]} body
 * @param {object} store 
 * @param {string} store.slug 
 */
const _createCsvForSeller = async (body, store) => {
    try {
        const exportAction = new ExportAction()

        const header = _getHeader('csv_seller')

        // make file csv
        const workbook = await exportAction.exportCsv(header, body)

        // Write the workbook to a buffer;
        const buffer = await workbook.csv.writeBuffer()

        // upload to s3x
        const { data, error } = await UploadService.uploadBuffer({
            buffer,
            directory: DIRECTORY,
            filename: `${store.slug}-CB-${_formatDate(Date.now())}.csv`,
            mimetype: 'text/csv'
        })

        if (error || !data) {
            throw new Error(error)
        }

        return data.Location
    } catch (error) {
        throw new Error(error)
    }
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
 * @param {any[]} body
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
 * make file excel for seller
 * @param {any[]} body
 * @param {object} store 
 * @param {string} store.slug 
 */
const _createSheetByStore = async (body, parentTime, store) => {
    try {
        const exportAction = new ExportAction()

        const filePath = _getFilePath(CASHBACK_STATISTICS + parentTime)

        const header = _getHeader('excel_store')

        await exportAction.addNewSheet({
            filePath, sheetName: store.slug, header, body
        })
    } catch (error) {
        throw new Error(error)
    }
}

const _handlerStatisticCashbackDetail = async (cashbackCalculationJobId, retry = 0) => {
    if (retry) Logger.info(`${[TAG]} Calculation Job: ${cashbackCalculationJobId} | nthTry ${retry}`)

    try {
        const Store = getModel('Store')
        const CashbackCalculationJob = getModel('CashbackCalculationJob')
        const CashbackCalculationDetail = getModel('CashbackCalculationDetail')
        const CashbackCalculationHistory = getModel('CashbackCalculationHistory')
        const CashbackRule = getModel('CashbackRule')

        // check Cashback Calculation Job
        const calculationJob = await CashbackCalculationJob.findById(cashbackCalculationJobId)
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

        if (!calculationJob) throw new Error('Cashback Calculation Job not found')

        const { store, cashback_rule_ids: cashback_rule, parent_id: parent } = calculationJob
        if (!store || !cashback_rule || !parent) throw new Error('Data rendering condition is not satisfied')

        // timer
        const parentTime = _formatDate(new Date(parent.created_at))

        // get totalCashback
        const statisticTotalCashback = await CashbackCalculationDetail.aggregate([
            {
                $match : {
                    calculation_job_id: mongoose.Types.ObjectId(cashbackCalculationJobId)
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

        const cashbackRuleTypes = []

        cashback_rule.forEach(rule =>{
            cashbackRuleTypes.push(rule.cashback_type)
        })

        const cashbackRuleTypeUnique = cashbackRuleTypes.filter(_onlyUnique).join(', ')

        // add statistics to the sheet summary
        const bodySummary = [
            {
                store: store.slug,
                storeUrl: store.domain,
                cashback: totalCashback,
                cashbackRuleTypes: cashbackRuleTypeUnique
            }
        ]
        
        // summary sheet
        await _upsertSheetSummary(bodySummary, parentTime)

        return recursiveCalculation(cashbackCalculationJobId, parentTime, store, cashbackRuleTypeUnique)


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

        // add new sheet
        const worksheet = workbook.addWorksheet(store.slug)
        
        worksheet.columns = _getHeader('excel_store')
        const header = worksheet.getRow(1)
        header.alignment = this._alignmentHeader
        header.fill = this._fillHeader
        header.border = this._borderHeader
        header.height = 20

        // get list cashback details
        const listCashbackDetails = await CashbackCalculationDetail.find({ calculation_job_id: cashbackCalculationJobId }).limit(10)

        // format data
        const { bodyStore, bodyCsvForSeller } = _formatPayload(listCashbackDetails, store)

        // create file excel for seller upload to system
        await _createSheetByStore(bodyStore, parentTime, store)
        
        // upload csv for seller to s3 and get the link download
        const fileUrl = await _createCsvForSeller(bodyCsvForSeller, store)
        if (!fileUrl) throw new Error('Upload file statistic failed')




        // create file csv for seller upload to system
        const bodyCsv = [{ store_id: store.slug, value: totalCashback, link_detail: fileUrl }]
        await _createCsvForManager(bodyCsv, parentTime)

        return {
            cashback_detail_file_url: fileUrl,
            total_cashback: totalCashback
        }
    } catch (error) {
        if (retry < MAX_RETRY_STATISTIC_CASHBACK_DETAIL) {
            const newRetry = retry + 1;
            await delay(newRetry * 5000) // wait 5s * number of retry  before retry
            return _handlerStatisticCashbackDetail(cashbackCalculationJobId, newRetry )
        }
        // capture the sentry before throwing exception
        throw new Error(error)
    }
}


const recursiveCalculationAddRow = async (worksheet, csv, store, cashbackCalculationJobId, cashbackRuleTypeUnique, lastTime = null) => {
    const CashbackCalculationDetail = getModel('CashbackCalculationDetail')
    // get list cashback details
    const query = {
        calculation_job_id: cashbackCalculationJobId
    }
    if (lastTime) query.created_at = { $gt: lastTime }
    const listCashbackDetails = await CashbackCalculationDetail.find(query).limit(100).lean()

    console.log({ adu: listCashbackDetails.length, start: listCashbackDetails[0], last: listCashbackDetails[listCashbackDetails.length - 1] })
    
    if (!listCashbackDetails.length) return

    listCashbackDetails.forEach(detail => {
        const commonData = {
            store: store.slug,
            orderNumber: detail.order_number,
            orderCreated: detail.order_created_date,
            buyerPaidAt: detail.buyer_paid_at,
            sellerPaidAt: detail.seller_paid_at,
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
    const CashbackCalculationDetail = getModel('CashbackCalculationDetail')

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
    const csv = workbook.addWorksheet(store.slug);
    csv.columns = _getHeader('csv_seller')

    await recursiveCalculationAddRow(worksheet, csv, store, cashbackCalculationJobId, cashbackRuleTypeUnique)

    // write file
    await workbook.xlsx.writeFile(filePath)

    return
    // get list cashback details
    const listCashbackDetails = await CashbackCalculationDetail.find({ calculation_job_id: cashbackCalculationJobId }).limit(10)

    // format data
    const { bodyStore, bodyCsvForSeller } = _formatPayload(listCashbackDetails, store)

    // create file excel for seller upload to system
    await _createSheetByStore(bodyStore, parentTime, store)

    // upload csv for seller to s3 and get the link download
    const fileUrl = await _createCsvForSeller(bodyCsvForSeller, store)
    if (!fileUrl) throw new Error('Upload file statistic failed')
}

/**
 *  Uploads a buffer containing file data to a specified directory in a cloud storage service.
 * 
 * @param {object} file 
 * @param {CASHBACK_UPLOAD|CASHBACK_STATISTICS|string} file.name
 * @param {'csv'|'xlsx'} file.type 
 * @param {string} file.time 
 * @param {'text/csv'|undefined} mimetype 
 * @returns 
 */
const _UploadS3WithStream = async (file, mimetype) => {
    const filePath = _getFilePath(file.name + file.time, file.type)
    if (!fs.existsSync(filePath)) throw new Error('Could not find file ' + file.name + file.time)
    
    const readStream = fs.createReadStream(filePath);

    // upload to s3
    const { data, error } = await UploadService.uploadBuffer({
        directory: DIRECTORY,
        filename: `${file.name}-CB-${_formatDate(Date.now())}.${file.type}`,
        mimetype: mimetype || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: readStream
    }, { useStream: true })

    if (error || !data) {
        throw new Error(error)
    }

    return data
}

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

exports.handlerStatisticCashbackDetail = _handlerStatisticCashbackDetail
exports.handlerUploadCashbackForSeller = _handlerUploadCashbackForSeller