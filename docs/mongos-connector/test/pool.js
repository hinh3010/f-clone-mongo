const {ConnectionPool} = require('../dist/index')
const path = require('path')


const _run = async () => {
    const schemas = path.join(__dirname, 'schemas')

    const maps = {
        // 'tenant_qa': 'mongodb://dev-mongodb:27017/tenant_qa',
        // 'marketplace_qa': 'mongodb://dev-mongodb:27017/marketplace_qa',
    }

    const connectionPool = new ConnectionPool(maps, {debug: true}, schemas)

    const namespace = 'dev2-common'
    const uri = 'mongodb://mongodb:27017/owner'
    const store = connectionPool.add('owner', uri).getStore('owner')
    const Store = store.getModel('Store')
    const _store = await store.findOne().select('title').lean()

    console.log(_store)
}

setImmediate(async () => {
    try {
        await _run()
    } catch (error) {
        console.log('ERROR:', error)
    }
})
