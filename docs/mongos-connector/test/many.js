const {ConnectionPool} = require('../dist/index')
const path = require('path')
const Promise = require('bluebird')


const _run = async () => {
    const schemas = path.join(__dirname, 'schemas')

    const maps = {
        'tenant_qa': 'mongodb://dev-mongodb:27017/tenant_qa',
    }

    const connectionPool = new ConnectionPool(maps, {debug: true}, schemas)

    const arr = new Array(100).fill(null)
    const list = arr.map((_, index) => index + 1)

    list.forEach(item => {
    })

    await Promise.map(list, async (item) => {
        const ns = `store_${item}`
        connectionPool.add(ns, `mongodb://dev-mongodb:27017/${ns}`)

        try {
            const store = connectionPool.getStore(ns)

            const Product = store.getModel('Product')
            const product = await Product.create({
                title: "Product" + Date.now(),
            })

            console.log(product)
        } catch (error) {
            console.log("ERROR", error)
        }
    }, {concurrency: 10})
}

setImmediate(async () => {
    setInterval(async () => {
        require('./mem_usage')()
    }, 2000)

    try {
        await _run()
    } catch (error) {
        console.log('ERROR:', error)
    }
})
