const {ConnectionPool} = require('@pf126/mongos-connector')
const schemas = require('@pf126/store-schemas')

const connectionPool = new ConnectionPool({}, {
    debug: process.env.MONGOOSE_DEBUG === 'enabled',
    poolSize: parseInt(process.env.MONGO_POOL_SIZE || 10),
}, schemas)

module.exports = connectionPool
