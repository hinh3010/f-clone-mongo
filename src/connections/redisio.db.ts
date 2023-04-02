import { createConnect, SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis'
import { Env } from '../config'

export const RedisIoClient = createConnect(Env.REDIS_CONNECTION.URI)
export const falcol = new SimpleFalcon(RedisIoClient)
export const redlock = new SimpleRedlock([RedisIoClient])

// import Redis from 'ioredis'
// import Logger from '../@loggers/logger.pino'
// export const RedisIoClient = new Redis({
//   host: Env.REDIS_CONNECTION.HOST,
//   port: Env.REDIS_CONNECTION.PORT,
//   password: Env.REDIS_CONNECTION.PASSWORD,
//   username: Env.REDIS_CONNECTION.USERNAME,
//   connectTimeout: 5000, // maximum time to connect to Redis, default is 10S
//   enableReadyCheck: true, // check Redis connection before starting to use
//   maxRetriesPerRequest: 5, // max reconnects per command execution, default is 20
//   retryStrategy: (times) => {
//     // try reconnecting after the number of seconds returned.
//     if (times <= 3) {
//       return 1000
//     }
//     return null
//   }
// })

// RedisIoClient.on('connect', () => {
//   Logger.info('[RedisIo:::] connected!!')
// })

// RedisIoClient.on('error', (err) => {
//   Logger.error(`[RedisIo:::] client Error ${err}`)
// })

// process.on('SIGINT', async () => {
//   RedisIoClient.disconnect()
//   process.exit(0)
// })

// process.on('SIGTERM', async () => {
//   RedisIoClient.disconnect()
//   process.exit(0)
// })
