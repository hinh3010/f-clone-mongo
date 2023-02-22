import { createClient } from 'redis'
import Logger from '../@loggers/logger.pino'

const redisClient = createClient({
  url: 'redis://alice:foobared@awesome.redis.server:6380'
})

redisClient.on('error', (err) => {
  Logger.error('[Redis:::] client Error', err.message)
  throw err
})

redisClient.on('connect', function () {
  Logger.info('[Redis:::] connected!!')
})

redisClient.on('ready', function () {
  Logger.info('[Redis:::] ready!!')
})

redisClient.on('end', () => {
  Logger.info('[Redis:::] client disconnected')
})

export const redisDbConnect = async (): Promise<void> => {
  try {
    await redisClient.connect()
  } catch (err: unknown) {
    if (err instanceof Error) {
      Logger.error(`[Redis:::] failed to connect!! - ${err.message}`)
    } else {
      Logger.error(`[Redis:::] failed to connect!! - ${err}`)
    }
    throw new Error('[Redis:::] failed to connect!!')
  }
}

export default redisClient
