const getEnv = require('../helpers/getEnv')
const elasticSearchHost = getEnv('/elasticSearch')
const {createElasticConnection, ConnectionPool} = require('@pf126/panther')
const {getSimpleLogger} = require('@pf126/parrot')
const Logger = getSimpleLogger()


Logger.info('Elasticsearch URI:', elasticSearchHost || 'http://localhost:9200')
// module.exports = createElasticConnection({uri: elasticSearchHost || 'http://localhost:9200'})
module.exports = new ConnectionPool()
