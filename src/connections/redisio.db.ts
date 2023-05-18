import { SimpleFalcon, SimpleRedlock, createConnect } from '@hellocacbantre/redis'
import { type IContext } from '@hellocacbantre/context'

export const getRedisClient = (uri: string) => createConnect(uri)

export const getFalcol = (context: IContext): SimpleFalcon => {
  const { redisDb } = context
  const falcol = new SimpleFalcon(redisDb.instance)
  return falcol
}

export const getRedlock = (context: IContext): SimpleRedlock => {
  const { redisDb } = context
  const redlock = new SimpleRedlock([redisDb.instance])
  return redlock
}

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
