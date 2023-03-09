const {createRedisConnection} = require('@pf126/falcon-v2')
const { getSimpleSentry } = require('@pf126/sentry')

const sellerRedis = createRedisConnection({
    url: process.env.REDIS_SELLER_URI || 'redis://redis-master:6379/1'
})

sellerRedis.on("end", () => {
    const sentry = getSimpleSentry()
    sentry.capture('Redis on disconnect', {tag: 'redis'})
})

sellerRedis.on("disconnect", () => {
    const sentry = getSimpleSentry()
    sentry.capture('Redis on disconnect', {tag: 'redis'})
})

sellerRedis.on('error', err => {
    const sentry = getSimpleSentry()
    sentry.capture(err, {extra: true, tag: 'redis'})
})

module.exports = sellerRedis
