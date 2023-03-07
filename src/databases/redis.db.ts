import { createClient } from 'redis'
import Logger from '../@loggers/logger.pino'
import { Env } from '../config'

export const RedisClient = createClient({
  url: Env.REDIS_CONNECTION.URI
})

RedisClient.on('error', (err) => {
  Logger.error(`[Redis:::] client Error - ${err.message}`)
  throw err
})

RedisClient.connect()
  .catch((err: unknown) => {
    if (err instanceof Error) {
      Logger.error(`[Redis:::] failed to connect!! - ${err.message}`)
    } else {
      Logger.error(`[Redis:::] failed to connect!! - ${err}`)
    }
    throw new Error('[Redis:::] failed to connect!!')
  })

RedisClient.on('connect', function () {
  Logger.info('[Redis:::] connected!!')
})

RedisClient.on('ready', function () {
  Logger.info('[Redis:::] ready!!')
})

RedisClient.on('end', () => {
  Logger.info('[Redis:::] client disconnected')
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', async () => {
  await RedisClient.disconnect()
  process.exit(0)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', async () => {
  await RedisClient.disconnect()
  process.exit(0)
})
