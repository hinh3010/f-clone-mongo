import Redis from 'ioredis'
import { Env } from '../../../config'
import Logger from '../logger.pino'

export const RedisIo = new Redis({
  host: Env.REDIS_CONNECTION.HOST,
  port: Env.REDIS_CONNECTION.PORT,
  password: Env.REDIS_CONNECTION.PASSWORD,
  username: Env.REDIS_CONNECTION.USERNAME,
  connectTimeout: 5000, // maximum time to connect to Redis, default is 10S
  enableReadyCheck: true, // check Redis connection before starting to use
  maxRetriesPerRequest: 5, // max reconnects per command execution, default is 20
  retryStrategy: (times) => { // try reconnecting after the number of seconds returned.
    if (times <= 3) {
      return 1000
    }
    return null
  }
})

RedisIo.on('connect', () => {
  Logger.info('[RedisIo:::] connected!!')
})

RedisIo.on('error', (err) => {
  Logger.error(`[RedisIo:::] client Error ${err}`)
})

RedisIo.on('ready', function () {
  Logger.info('[RedisIo:::] ready!!')
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', async () => {
  RedisIo.disconnect()
  process.exit(0)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', async () => {
  RedisIo.disconnect()
  process.exit(0)
})
