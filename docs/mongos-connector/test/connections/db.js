const {ConnectionPool} = require('../../dist')
const path = require('path')
// const {ConnectionPool} = require('mongos')
const schemas = path.join(__dirname, '../schemas')
const {mongoose} = require('../../dist')

const maps = {
    // 'global': 'mongodb://mongodb:27017/dev2',
    // 'dev2bp': 'mongodb://mongodb:27017/dev2_bp',
}

const getPoolSize = (ratio) => {
    return (process.env.NUMBER_OF_STORE && parseInt(process.env.NUMBER_OF_STORE) || 100) / ratio
}

const connectionPool = new ConnectionPool(maps, {
    debug: false,
    useUnifiedTopology: true,
    // poolSize: process.env.NEW && getPoolSize(1) || 2,
    poolSize: 10,
    // maxPoolSize: 100,
    // minPoolSize: 4,
    connectTimeout: 5000,
    // defaultWriteConcern: true,
}, schemas)

console.log(connectionPool.opts)

module.exports = connectionPool
