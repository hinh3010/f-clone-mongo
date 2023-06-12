const patchConfig = process.env.NODE_ENV === 'production' ? 'production.env' : 'dev.env'

require('dotenv').config({path: patchConfig})
const CashbackCalculationJobActions = require('../src/actions/CashbackCalculationJobActions')
const CashbackCalculationHistoryActions = require('../src/actions/CashbackCalculationHistoryActions')
const postman = require('../src/connections/postman')
const { handlerStatisticCashbackDetail, handlerUploadCashbackForSeller, useStreamDatabase } = require('../src/actions/_ExportStatisticCashbackHandler')

setImmediate(async () => {
    console.log('\n\n\nSTART :::::::::::::::::::::::::::::::::::::::::::::::::::::::::\n\n\n')
    try {
        // await CashbackCalculationJobActions.calculateCashback('647446bd9d64d808687398c8')
        // await CashbackCalculationHistoryActions.calculateCashbackHistory('647edb9cbc48b266d1b1fea1')
        // const data = await handlerStatisticCashbackDetail('647446bd9d64d808687398c8')
        // await useStreamDatabase('647446bd9d64d808687398c8',{slug:'i666666'})
        const data = await handlerUploadCashbackForSeller('647446bd9d64d808687398c3')
        data && console.log("🚀 hello cac ban tre  ~ file: cashback-rule.js:15 ~ setImmediate ~ data~", data)
    } catch (error) {
        console.error(error.message)
    }
    console.log('\n\n\nEND :::::::::::::::::::::::::::::::::::::::::::::::::::::::::\n\n\n')
})
