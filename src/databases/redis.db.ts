import { createClient } from 'redis'

const redisClient = createClient({
  url: 'redis://alice:foobared@awesome.redis.server:6380'
})

redisClient.on('error', (err) => {
  console.log('[Redis:::] client Error', err.message)
  throw err
})

redisClient.on('connect', function () {
  console.log('[Redis:::] connected!!')
})

redisClient.on('ready', function () {
  console.log('[Redis:::] ready!!')
})

redisClient.on('end', () => {
  console.log('[Redis:::] client disconnected')
})

export const redisDbConnect = async (): Promise<void> => {
  try {
    await redisClient.connect()
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`[Redis:::] failed to connect!! - ${err.message}`)
    } else {
      console.log(`[Redis:::] failed to connect!! - ${err}`)
    }
    throw new Error('[Redis:::] failed to connect!!')
  }
}

export default redisClient
