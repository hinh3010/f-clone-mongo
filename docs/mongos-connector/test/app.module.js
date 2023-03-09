require('dotenv').config({
    path: require('path').join(__dirname, '.env')
})
const v8 = require('v8')

//

const {AppModule} = require('@pf126/core-v2')
const {MongoProvider, getStore} = require('../dist')

const appModule = new AppModule({
    clusterId: process.env.CLUSTER_ID,
    serviceName: 'test-service',
    namespace: process.env.GROUP_NAMESPACE
})

const {PROVIDER_NATS, NatsProvider} = require('@pf126/postman-v2')
appModule.register(PROVIDER_NATS, new NatsProvider(require('./connections/nats')))

const {PROVIDER_SETTING, SettingProvider} = require('@pf126/setting-container-v2')
appModule.register(PROVIDER_SETTING, new SettingProvider(require('./connections/setting')))

const {PROVIDER_MONGODB, CONNECTION_EVENT} = require('../dist')
const mongoProvider = new MongoProvider(require('./connections/db'))
appModule.register(PROVIDER_MONGODB, mongoProvider)

const getOrder = async storeSlug => {
    console.log('DEBUG: getOrder')
    const {getModel} = getStore({app: appModule, context: {storeId: storeSlug}})
    const Order = getModel('Order')

    console.log(`${storeSlug}`, await Order.findOne({}).select('code').lean())
}

const {createStore} = require('../dist/single/createStore')
const pool = require('./connections/db')

const checkSize = async () => {
    const pool = require('./connections/db')
    const qa = pool.connections.get('qa6pet5')
    console.log('size', mongoProvider.getConnection().connections.size)
    pool.connections.delete('qa6pet5')
    // setTimeout(async ()=> {
    //     await pool.renew()
    //
    //     console.log(await mongoProvider.isConnected())
    // }, 5000)
    console.log('size', mongoProvider.getConnection().connections.size)
    console.log(await mongoProvider.isConnected())
    await mongoProvider.reload({name: 'RELOAD_SINGLE_STORE_SETTINGS', args: {storeId: 'qa6pet5'}})
    console.log('size', mongoProvider.getConnection().connections.size)
    console.log(await mongoProvider.isConnected())
    pool.connections.set('qa6pet5', null)
    console.log('size', mongoProvider.getConnection().connections.size)
    console.log(await mongoProvider.isConnected())
    pool.connections.set('qa6pet5', qa)
    console.log('size', mongoProvider.getConnection().connections.size)
    console.log(await mongoProvider.isConnected())
    pool.connections.set('test', qa)
    console.log('size', mongoProvider.getConnection().connections.size)
    console.log(await mongoProvider.isConnected())
    console.log('size', mongoProvider.getConnection().connections.size)
}

setImmediate(async () => {
    _logMem()
    try {
        await appModule.run()

        console.log(await mongoProvider.isConnected())
        setInterval(async () => {
            console.log(await mongoProvider.isConnected())
        }, 1000)

        return
        console.log('load ok')
        console.log(await mongoProvider.isConnected())

        // await checkSize()

        // const pool = require('./connections/db')
        // setTimeout(async ()=> {
        //     await pool.renew()
        //
        //     console.log(await mongoProvider.isConnected())
        // }, 5000)
        // console.log('re new ok')
        // const globalConn = mongoProvider.getConnection().connections.get('global')
        // const dev2 = globalConn.useDb('dev2_normal')
        // const dev2BP = globalConn.useDb('dev2_bp')
        //
        // const {getModel} = createStore(dev2, require('@pf126/store-schemas'))
        // const Order = getModel('Order')
        //
        // const {getModel: getModelBP} = createStore(dev2BP, require('@pf126/store-schemas'))
        // const OrderBP = getModelBP('Order')
        //
        // console.log(`dev2 >>>`, await Order.findOne().select('code').lean())
        // console.log(`dev2_bp >>>`, await OrderBP.findOne().select('code').lean())


        // mongoProvider.on(CONNECTION_EVENT.CONNECTED, (args) => {
        //     console.log('connected:', args)
        // })

        //
        const w2pvo2x = mongoProvider.getConnection().getStore('w2pvo2x').getConnection()
        // console.log(dev2Conn)
        // await appModule.run()
        setInterval(async () => {
            console.log(await mongoProvider.isConnected())
            await getOrder('w2pvo2x').catch(console.log)
        }, 5000)

        await getOrder('od86k4t').catch(console.log)

        await mongoProvider.reload({name: 'LIST_STORE_CHANGED', args: {add: [], remove: ['od86k4t']}})
        console.log(await mongoProvider.isConnected())
        mongoProvider.settingContainer.getResource('mongodb')['61d403f2d74b5415d32fe6c4'] = {
            '_id': '61d403f2d74b5415d32fe6c4',
            'name': 'mongodb-plc-cluster-1',
            'kind': 'mongodb',
            'specs': {
                'uri': 'ip-172-12-246-192.us-east-2.compute.internal:27017',
                'base_username': 'me',
                'base_password': '2eFDtCAYPbzUpWej',
                'base_auth_source': 'admin'
            }
        }
        // mongoProvider.settingContainer.getGroupSettings()['od86k4t'].resources.mongodb = mongoProvider.settingContainer.getResource('mongodb')['61d403f2d74b5415d32fe6c4']
        // await mongoProvider.reload({name: 'RELOAD_SINGLE_STORE_SETTINGS', args: {storeId: 'od86k4t'}})

        // await getOrder('od86k4t').catch(console.log)

        // await mongoProvider.getConnection().renew()
        // await mongoProvider.getConnection().renew()
        // await mongoProvider.getConnection().renew()
        // if (global.gc) {
        //     console.log('call gc')
        //     global.gc()
        // }
        const _getDbName = (storeNumber) => {
            return `qa_store_${storeNumber}`
        }
        for (let i = 1; i < 2; i++) {
            await mongoProvider.getConnection().add(_getDbName(i), {
                dbName: _getDbName(i), resource: {
                    '_id': '61d403f2d74b5415d32fe6c4',
                    'name': 'mongodb-plc-cluster-1',
                    'kind': 'mongodb',
                    'specs': {
                        'uri': 'ip-172-12-246-192.us-east-2.compute.internal:27018',
                        'base_username': 'me',
                        'base_password': '2eFDtCAYPbzUpWej',
                        'base_auth_source': 'admin'
                    }
                }
            })
        }
        // console.log(mongoProvider.getConnection().connections.size)
        //
        // if (global.gc) {
        //     console.log('call gc')
        //     global.gc()
        // }
        await mongoProvider.renew()
        // if (global.gc) {
        //     console.log('call gc')
        //     global.gc()
        // }
        // const conn = mongoProvider.getConnection()._getBaseConnection()
        // console.log(
        //     `otherDbs:${conn.otherDbs.length}`,
        //     `relatedDbs:${Object.keys(conn.relatedDbs).length}`
        // )
        // console.log(mongoProvider.getConnection().connections.size)
        // conn.close()
        // await getOrder(_getDbName(10))
        // await getOrder(_getDbName(100))
        // await getOrder(_getDbName(200))

        // qa6pet5.close()

        // console.log('firstConnect check', await mongoProvider.isConnected())
        //
        // setTimeout(async () => {
        //     dev2Conn._readyState = 2
        //     // console.log(dev2Conn)
        //
        //     console.log('Reconnect check', await mongoProvider.isConnected())
        //
        //     dev2Conn.__connectedBefore = false
        //     // console.log(dev2Conn)
        //
        //     console.log('Reconnect check 2', await mongoProvider.isConnected())
        // }, 500)

    } catch (e) {
        console.log('APP RUN ERROR', e)
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

module.exports = appModule

