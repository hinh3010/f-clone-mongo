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
const FORMAT_DATE = 'DD-MM-YYYY_HH-mm'
const TAG = 'CASHBACK'
const MAX_RETRY_STATISTIC_CASHBACK_DETAIL = 2
const MAX_RETRY_UPLOAD_FILE_STATISTIC_CASHBACK = 2


/**
 * 
 * @param {*} listCashbackDetails 
 * @param {object} store 
 * @param {string} store.slug
 * @returns 
 */
const _formatPayload = (listCashbackDetails, store) =>{
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
            variantTitle: detail.variant_title
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

const _getFilePath = (name, mimetype = 'xlsx') => {
    const fileName = `${name}.${mimetype}`
    const filePath = path.join(__dirname, `/upload_cashback/${fileName}`)

    return filePath
}

const _getHeader = (type) => {
    const headerCsvForSeller = ['Store', 'Order Number', 'Created Date', 'Buyer Paid At', 'Seller Paid At', 'Product Type', 'Variant Title', 'Quantity', 'Cashback']
   
    const headerCsvUploadSystem = ['store_id', 'value', 'link_detail']

    const headerSummary = [
        { header: 'Store', key: 'store', width: 10 },
        { header: 'Store URL', key: 'storeUrl', width: 50 },
        { header: 'Cashback', key: 'cashback', width: 20 },
        { header: 'cashback Rule ID', key: 'cashbackRuleId', width: 30 }
    ]

    const headerStore = [
        { header: 'Store', key: 'store', width: 20 },
        { header: 'Order number', key: 'orderNumber', width: 20 },
        { header: 'Created Date', key: 'orderCreated', width: 20 },
        { header: 'Buyer Paid At', key: 'buyerPaidAt', width: 20 },
        { header: 'Seller Paid At', key: 'sellerPaidAt', width: 20 },
        { header: 'Product Type', key: 'productType', width: 20 },
        { header: 'Variant Title', key: 'variantTitle', width: 20 },
        { header: 'Variant Fulfill', key: 'variantFulfill', width: 20 },
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
            filename: `${store.slug}-${moment(Date.now()).format(FORMAT_DATE)}.csv`,
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
            await exportAction.exportExcel({
                filePath,
                sheetName: SUMMARY,
                body: body,
                header: header
            })
        } else {
            await exportAction.addNewRowExcel({
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

        // const newData = {
        //     "store": "6107c2a77d7a65dce05d8a22",
        //     "order_number": "RQ-59746-67688",
        //     "rule_id": "647817eff0f60346042d933e",
        //     "calculation_job_id": "647446bd9d64d808687398c8",
        //     "fulfillment_item_id": "645ddec1482b972d4aa0f878",
        //     "order_created_date": "2023-05-10T08:45:24.731+0000",
        //     "buyer_paid_at": "2023-05-10T08:45:24.711+0000",
        //     "seller_paid_at": "2023-05-12T06:40:03.187+0000",
        //     "type": "CROSS_TANK_3D",
        //     "variant_title": "youth-hawaiian-shirt / Multi-color / YXS",
        //     "variant_fulfill": "",
        //     "quantity": 3,
        //     "cashback": 150,
        //     "shipping_cost": 12,
        //     "base_price": 123,
        //     "fulfillment_cost": 22,
        //     "discount_amount": 0,
        //     "supplier": "1C",
        //     "country_code": "VN",
        // }
        // const arr = Array.from({ length:10000 }, (_, index) => index + 1)
        // await CashbackCalculationDetail.create(arr.map(() => newData))
        // const adu = await CashbackCalculationDetail.countDocuments({ calculation_job_id: cashbackCalculationJobId })
        // console.log("🚀 adu  ~ file: _ExportStatisticCashbackHandler.js:275 ~ const_handlerStatisticCashbackDetail= ~ adu~", adu)
        // const cursor = await CashbackCalculationDetail.collection.aggregate([{
        //     $match: { calculation_job_id: mongoose.Types.ObjectId(cashbackCalculationJobId) }
        // }], { cursor: { batchSize: 10000 }, allowDiskUse: true })
        // cursor.on('data', (doc) => {
        //     console.log('adu', doc);
        // });

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
                }
            ])
            .lean()

        if (!calculationJob) throw new Error('Cashback Calculation Job not found')

        // get store info
        const { store, cashback_rule_ids, parent_id: parent } = calculationJob

        if (!store || !cashback_rule_ids || !parent) throw new Error('Data rendering condition is not satisfied')

        // timer
        const parentTime = moment(new Date(parent.created_at)).format(FORMAT_DATE)

        // get list cashback details
        const listCashbackDetails = await CashbackCalculationDetail.find({ calculation_job_id: cashbackCalculationJobId }).limit(10)

        // format data
        const { totalCashback, bodyStore, bodyCsvForSeller } = _formatPayload(listCashbackDetails, store)

        // create file excel for seller upload to system
        const bodySummary = [
            {
                store: store.slug,
                storeUrl: store.domain,
                cashback: totalCashback,
                cashbackRuleId: cashback_rule_ids.join(', ')
            }
        ]
        await _upsertSheetSummary(bodySummary, parentTime)
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
        if (retry < 0) {
            const newRetry = retry + 1;
            await delay(newRetry * 5000) // wait 5s * number of retry  before retry
            return _handlerStatisticCashbackDetail(cashbackCalculationJobId, newRetry )
        }
        // capture the sentry before throwing exception
        throw new Error(error)
    }
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
        filename: `${file.name}-${moment(Date.now()).format(FORMAT_DATE)}.${file.type}`,
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
    const parentTime = moment(new Date(calculationHistory.created_at)).format(FORMAT_DATE)

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

// const withRetry = async (fn, maxRetry = 2) => {
//     return async (...args) => {
//         let retry = 0;
//         while (true) {
//             try {
//                 return await fn(...args);
//             } catch (error) {
//                 if (retry >= maxRetry) {
//                     throw new Error(error);
//                 }
//                 retry += 1;
//                 await delay(retry * 5000);
//             }
//         }
//     };
// };

// const _handlerUploadCashbackForSeller2 = withRetry(async (calculationId) => {
//     const CashbackCalculationHistory = getModel('CashbackCalculationHistory');
//     const calculationHistory = await CashbackCalculationHistory.findById(calculationId).lean();

//     if (!calculationHistory) {
//         return false;
//     }

//     // timer
//     const parentTime = moment(new Date(calculationHistory.created_at)).format(FORMAT_DATE);

//     const [{ Location: total_cashback_file_url }, { Location: summary_file_url }] = await Promise.all([
//         _UploadS3WithStream({ name: CASHBACK_UPLOAD, type: 'csv', time: parentTime }, 'text/csv'),
//         _UploadS3WithStream({ name: CASHBACK_STATISTICS, type: 'xlsx', time: parentTime })
//     ]);

//     console.log({
//         total_cashback_file_url,
//         summary_file_url
//     });
//     return {
//         total_cashback_file_url,
//         summary_file_url
//     };
// }, MAX_RETRY_STATISTIC_CASHBACK_DETAIL);


const _useStreamDatabase = async (cashbackCalculationJobId, store) => {
    const exportAction = new ExportAction()
    const CashbackCalculationDetail = getModel('CashbackCalculationDetail')

    // watch file path
    const managerFilePath = _getFilePath(CASHBACK_STATISTICS)
    // const systemFilePath = _getFilePath(CASHBACK_UPLOAD)

    // check summary sheet
    const isSummarySheet = await exportAction.sheetExists(managerFilePath, SUMMARY)

    // initialize workbook
    const workbook = new Excel.Workbook();

    // if not exists then create new summary sheet
    if (!isSummarySheet){
        // add summary sheet
        const worksheet = workbook.addWorksheet(SUMMARY)

        // add header
        worksheet.columns = _getHeader('excel_summary')
        const header = worksheet.getRow(1)
        header.alignment = this._alignmentHeader
        header.fill = this._fillHeader
        header.border = this._borderHeader
        header.height = 20
    }

    // create store sheet
    const currStoreSheet = workbook.getWorksheet(store.slug)
    if (currStoreSheet) {
        // delete sheet
        workbook.removeWorksheet(currStoreSheet.id)
    }

    // add store sheet
    const worksheet = workbook.addWorksheet(store.slug)

    // add header
    worksheet.columns = _getHeader('excel_store')
    const header = worksheet.getRow(1)
    header.alignment = this._alignmentHeader
    header.fill = this._fillHeader
    header.border = this._borderHeader
    header.height = 20

    // get sheet
    const storeSheet = workbook.getWorksheet(store.slug)
    const summarySheet = workbook.getWorksheet(SUMMARY)

    // stream data from database
    const cursor = CashbackCalculationDetail
        .find({ calculation_job_id: cashbackCalculationJobId })
        .limit(10)
        .lean()
        .cursor({ batchSize: 10 })

    // add row for summary sheet and store sheet using stream database
    let totalCashback = 0
    for await (const detail of cursor) {
        totalCashback += detail.cashback
        const commonData = {
            store: store.slug,
            orderNumber: detail.order_number,
            orderCreated: detail.order_created_date,
            buyerPaidAt: detail.buyer_paid_at,
            sellerPaidAt: detail.seller_paid_at,
            productType: detail.type,
            variantTitle: detail.variant_title
        }

        storeSheet.addRow({
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

    }

    // return result
}

exports.useStreamDatabase = _useStreamDatabase
exports.handlerStatisticCashbackDetail = _handlerStatisticCashbackDetail
exports.handlerUploadCashbackForSeller = _handlerUploadCashbackForSeller


const _createRows = (worksheet, data) => {
    data.forEach((rowData, i) => {
        const row = worksheet.addRow(rowData);
        if (i % 2) {
            row.fill = this._fillRow
        }
        row.border = this._borderRow
        row.alignment = this._alignmentRow
    });
    return worksheet;
}