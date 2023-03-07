import { createClient } from 'redis'
import Logger from '../logger.pino'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const redisConnect = (uri = process.env.REDIS_URI): any => {
  const RedisClient = createClient({
    url: uri
  })

  RedisClient.on('error', (err: { message: any }) => {
    Logger.error(`[Redis:::] client Error - ${err.message}`)
    throw new Error(`[Redis::: ] failed to connect!! - ${err.message}`)
  })

  RedisClient.connect()
    .catch((err: { message: any }) => {
      Logger.error(`[Redis:::] failed to connect!! - ${err.message}`)
      throw new Error(`[Redis::: ] failed to connect!! - ${err.message}`)
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

  return RedisClient
}

export default redisConnect
