const {Postman} = require('@pf126/postman-v2')
const nats = require('../connections/nats')

const postman = new Postman(nats)

module.exports = postman

