const {createNATSConnection, Postman} = require('@pf126/postman-v2')

const nats = createNATSConnection({
    url: process.env.NATS_URI,
    json: true,
})

module.exports = nats