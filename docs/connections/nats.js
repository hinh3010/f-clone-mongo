const {createNATSConnection} = require('@pf126/postman-v2')
const getEnv = require('../helpers/getEnv')
const natsConfig = getEnv('/nats')
const {getSimpleSentry} = require('@pf126/sentry')

const nats = createNATSConnection(natsConfig)

nats.on("close", () => {
    const sentry = getSimpleSentry()
    sentry.capture('Nats on closed', {tag: 'nats'})
})

nats.on("disconnect", () => {
    const sentry = getSimpleSentry()
    sentry.capture('Nats on disconnect', {tag: 'nats'})
})

nats.on('error', err => {
    const sentry = getSimpleSentry()
    sentry.capture(err, {extra: true, tag: 'nats'})
})

module.exports = nats
