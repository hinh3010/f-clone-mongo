require('dotenv').config({
    path: require('path').join(__dirname, '.env')
})

const MongoConnector = require('../dist/index')
const path = require('path')
const pool = require('./connections/db')
const {MongoProvider} = require('../dist')
const mongoProvider = new MongoProvider(pool)
// const schemas = require('@pf126/store-schemas')
const schemas = path.join(__dirname, 'schemas')
const Bluebird = require('bluebird')
const mongoose = require('mongoose')
const pgClient = require('./connections/pg')
// const URI = 'mongodb://dev-mongodb:27017/tenant_qa'

const _getMonitorMemTbl = () => `memory_usage_${process.env.NEW ? 'new' : 'old'}`
const _initPg = async () => {
    console.log(`[PG] INIT`)

    await pgClient.connect()

    const createTableIfNotExists = `CREATE TABLE IF NOT EXISTS ${_getMonitorMemTbl()} (
        id SERIAL PRIMARY KEY,
        rss INT,
        heapTotal INT,
        heapUsed INT,
        external INT,
        arrayBuffers INT,
        timePerOperation FLOAT,
        timestamp timestamp default current_timestamp
    );`

    await pgClient.query(createTableIfNotExists)

    console.log(`[PG] INIT_DONE`)
}

const _getValue = (row) => {
    const values = Object.values(row)

    return `(${values.join(',')})`
}

const _getColumn = (row) => {
    const keys = Object.keys(row)

    return `(${keys.join(',')})`
}

const _insert = (tbl, row) => {
    let query = `INSERT INTO ${tbl}`
    query += _getColumn(row)
    query += ` VALUES `
    query += _getValue(row)
    query += `;`

    return pgClient.query(query)
}

const _insertMany = (tbl, rows) => {
    let query = `INSERT INTO ${tbl}`
    query += _getColumn(rows[0])
    query += ` VALUES `
    rows.forEach((row) => {
        query += _getValue(row) + ','
    })
    query = query.slice(0, -1)
    query += `;`

    return pgClient.query(query)
}

const timesToSend = 6
const rssThresholdToSend = 150 * 1024 * 1024444
let timePerOperation = 0

const _sendMemory = () => {
    let checkTime = 6

    return async () => {
        try {
            const used = _getMem()
            if (used < rssThresholdToSend || checkTime < timesToSend) {
                checkTime++
                return
            }
            checkTime = 0
            used.timePerOperation = timePerOperation

            await _insert(_getMonitorMemTbl(), used)
            console.log(`[MONITOR] SEND_SUCCESS`)
        } catch (e) {
            console.log(`[MONITOR] SEND_ERROR: ${e.message}, close app.`)
            process.exit(1)
        }

    }
}

const _setupMonitor = () => {
    const interval = 5000
    console.log(`[MONITOR] START`)
    setInterval(_sendMemory(), interval)
}

const _granUser = async () => {
    const adminConn = pool.connections.get('admin')

    for (let i = 88; i <= 100; i++) {
        const curDb = await adminConn.client.db(_getDbName(i))
        const command = {
            createUser: 'store',
            pwd: 'store',
            roles: [
                {
                    role: 'readWrite',
                    db: _getDbName(i),
                }
            ],
            mechanisms: ['SCRAM-SHA-256']
        }

        curDb.command(command, (error, result) => {
            console.log(error)
            console.log(result)
        })
    }
}

// const _run = async () => {
//     const connection = MongoConnector.createConnection(URI, {
//         debug: true
//     })
//
//     const schemas = path.join(__dirname, 'schemas')
//
//     const store = MongoConnector.createStore(connection, schemas)
//     const Product = store.getModel('Product')
//
//     const product = await Product.findOne({}).select('title').lean()
//     console.log(product)
// }

const getProduct = async (conn) => {
    const store = MongoConnector.createStore(conn, schemas)
    const Product = store.getModel('Product')

    const product = await Product.findOne({}).select('title').lean()

    return product
}

const getSetting = async (conn, name) => {
    const store = MongoConnector.createStore(conn, schemas)
    const StoreSetting = store.getModel('StoreSetting')

    const setting = await StoreSetting.findOne({value: name}).select('value').lean()

    return setting
}

const bulkUpdateSetting = async (conn, name, settings) => {
    const store = MongoConnector.createStore(conn, schemas)
    const StoreSetting = store.getModel('StoreSetting')

    return StoreSetting.bulkWrite(settings.map(doc => {
        return {
            updateOne: {
                filter: {_id: doc._id},
                update: {
                    $set: {
                        value: Date.now()
                    }
                }
            },
        }
    }))
}

let limitRate = 1

const getManySetting = async (conn, name) => {
    const store = MongoConnector.createStore(conn, schemas)
    const StoreSetting = store.getModel('StoreSetting')

    return StoreSetting.find({key: name}).sort({_id: -1}).limit(limitRate * 10).lean()
}

const insertManySetting = async (conn, name) => {
    const store = MongoConnector.createStore(conn, schemas)
    const StoreSetting = store.getModel('StoreSetting')

    return StoreSetting.insertMany((new Array(100)).fill({key: name, value: Date.now()}))
}

const insertStoreSetting = async (conn, name) => {
    const store = MongoConnector.createStore(conn, schemas)
    const StoreSetting = store.getModel('StoreSetting')

    const setting = new StoreSetting({
        key: 'name',
        value: name
    })

    await setting.save()

    return setting.toJSON()
}

const _fetchForever = async (pool) => {
    let count = 0

    while (true) {
        const start = Date.now()
        await Bluebird.map([...pool.connections], async ([store, conn]) => {
            try {
                // console.log(await getProduct(conn))
                // console.log(await insertStoreSetting(conn, store))
                // console.log(store, await getSetting(conn, store))
                // await getSetting(conn, store)
                // await insertManySetiing(conn, store)
                const settings = await getManySetting(conn, store)
                await bulkUpdateSetting(conn, store, settings)
            } catch (e) {
                console.log(e.message)
            }
        }, {concurrency: 100})

        limitRate = ++limitRate % 11 || 1
        count++
        timePerOperation = (Date.now() - start) / 1000
        console.log(`\t\t[LOOP] ${count} - ${timePerOperation} s`)
        await Bluebird.delay(2000)
    }
}

const numberOfStore = process.env.NUMBER_OF_STORE && parseInt(process.env.NUMBER_OF_STORE) || 100

const _getDbName = (storeNumber) => {
    return `qa_store_${storeNumber}`
}

const _makeURI = (storeNumber) => {
    return `mongodb://store:store@ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27017,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27018,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27019/${_getDbName(storeNumber)}?replicaSet=rs0&authSource=admin`
}

const _getUris = () => {
    // return (new Array(numberOfStore)).fill(0).reduce((prev, _, i) => {
    //     return Object.assign(prev, {
    //         [_getDbName(i + 1)]: _makeURI(i + 1)
    //     })
    // }, {})

    return {
        // admin: 'mongodb://store:store@ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27017,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27018,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27019/admin?replicaSet=rs0',
        tenant_qa: 'mongodb://store:store@ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27017,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27018,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27019/?replicaSet=rs0',
        // tenant_qa: 'mongodb://qa:wr52qKdGLZbR9ea@ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27018/qa_tenant_qa',
        // dev2: 'mongodb://mongodb:27017/dev2_normal'
    }
}

const _getBaseURI = () => {
    return `mongodb://store:store@ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27017,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27018,ec2-18-118-41-160.us-east-2.compute.amazonaws.com:27019/?replicaSet=rs0`
}

const _increaseRAM = () => {

    // const big = new Array(10000000).join('*')
    // const big = Buffer.alloc(100000000).fill(1)
}

const _oldArchConnect = async () => {
    await Promise.all(new Array(numberOfStore).fill(0).map(async (_, i) => {
        const storeSlug = _getDbName(i + 1)
        const uri = _makeURI(i + 1)

        const error = await pool.add(storeSlug, uri)

        if (error) {
            throw error
        }
    }))
}

const _newArchConnect = async () => {
    await pool.add('base', _getBaseURI())
    const baseConn = pool.connections.get('base')

    // const baseConn = mongoose.createConnection(_getUris()['tenant_qa'], {
    // useCreateIndex: true,
    // useNewUrlParser: true,
    // useFindAndModify: false,
    //     useUnifiedTopology: true,
    // })

    new Array(numberOfStore).fill(0).map((_, i) => {
        const dbname = _getDbName(i + 1)
        const db = baseConn.useDb(dbname)
        // console.log(dbname)

        pool.connections.set(dbname, db)
    })
}

setImmediate(async () => {
    _logMem()
    // _increaseRAM()
    // _logMem()
    try {
        // const URIS = _getUris()

        // console.log(`Loading DB: ${Object.keys(URIS).join(', ')}`)
        // mongoose.set('debug', true)

        console.log('>>>> IS NEW ARCH?', !!process.env.NEW)

        await _initPg()

        _setupMonitor()

        console.log(`Loading DB: ${numberOfStore}`)

        !process.env.NEW && await _oldArchConnect()
        process.env.NEW && await _newArchConnect()

        // console.log(await mongoProvider.isConnected())

        // const conn = pool.connections.get('tenant_qa')
        // console.log(conn)

        // await getProduct(baseConn)

        // console.log(await mongoProvider.isConnected())
        // console.log(pool.connections)

        await _fetchForever(pool)

    } catch (error) {
        console.log('ERROR:', error)
    }
})

const _getMem = (toMB = false) => {
    const used = process.memoryUsage()

    return toMB ? Object.entries(used).reduce((prev, [k, v]) => {
        return Object.assign(prev, {[k]: Math.round(v / 1024 / 1024 * 100) / 100})
    }, {}) : used
}

const _logMem = () => {
    const usedify = JSON.stringify(_getMem(true))

    console.log(`\t[MEM] ${usedify}`)
}

setInterval(_logMem, 5000)
