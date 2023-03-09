const mongoose = require('mongoose')
const dns = require('dns')

setImmediate(async () => {
    // const connection = await mongoose.createConnection('mongodb://base:3s1cPQ206eqhQPmx@18.188.74.217:27017,18.118.24.91:27017,18.117.170.129:27017/dev?authSource=base&replicaSet=rs0', {
    //     useUnifiedTopology: true
    // })
    //
    const connection = await mongoose.createConnection('mongodb://base:3s1cPQ206eqhQPmx@172.22.104.186,172.22.158.137,172.22.116.229:27017/base?replicaSet=rs0', {
        minPoolSize: 1,
        poolSize: 1,
        useUnifiedTopology: true
    })
    connection.on('connected', () => {
        console.log('connected')
    })

    connection.on('error', (error) => {
        console.log('err', error)
    })
    // console.log(connection.)

    const dbConn = connection.useDb('z38pj87z', {noListener: true, useCache: false}).client

    const query = async (label, fn) => {
        console.time(label)
        const res = await fn()
        console.timeEnd(label)
        // return res
    }

    console.log(await Promise.all([
        query('agg', () => dbConn.db('z38pj87z').collection('products').findOne({"seo_information.description": {$regex: new RegExp(/\w+\d+/)}})),
        query('find', () => dbConn.db('z38pj87z').collection('orders').findOne())
    ]))

    // setInterval(() => {
    //     console.log('base', connection.readyState)
    //     console.log('db', dbConn.readyState)
    // }, 5000)


    // console.log(await connection.db.command({hostInfo: 1}))
    //
    // console.log(await connection.db.stats())

})