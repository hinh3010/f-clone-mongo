import { type RedisClientType } from 'redis'
import del from '../del'
import get from '../get'
import getMulti from '../getMulti'
import getTTL from '../getTtl'
import Logger from '../logger.pino'
import set from '../set'
import redisConnect from './connect'

// Ví dụ sử dụng
const test = async (): Promise<void> => {
  await import('./setup')
  const RedisClient: RedisClientType = await redisConnect()

  const key = 'adu'
  const value = [
    { age: 23, name: 'hello cac ban tre' }
  ]

  // const success = await set(RedisClient, key, value, 6000)

  // trả về true nếu lưu trữ thành công, ngược lại trả về false
  // Logger.info(`[Set:::${key}] success ${success}`)

  // console.log('[Get:::]', { [key]: await get(RedisClient, key) })

  // console.log('[Get TTL:::]', { [key]: await getTTL(RedisClient, key) })

  // const isDel = await del(RedisClient, key)

  const keys = ['adu', 'bdu', 'cdu']
  console.log('[Get Mutil:::]', await getMulti(RedisClient, keys))
  // const isDelMutil = await del(RedisClient, keys)

  // Logger.info(`[Del:::${key}] success ${isDel}`)

  void RedisClient.disconnect()
}

void test()
