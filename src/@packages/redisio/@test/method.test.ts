import del from '../del'
import edit from '../edit'
import get from '../get'
import getMulti from '../getMulti'
import getTTL from '../getTTL'
import Logger from '../logger.pino'
import set from '../set'
import { RedisIo } from './connect'

// Ví dụ sử dụng
const test = async (): Promise<void> => {
  await import('./setup')

  const key = 'adu'
  const value = NaN

  const success = await set(RedisIo, key, value)
  Logger.info(`[Set:::${key}] success ${success}`)

  const isEdit = await edit(RedisIo, key, value)
  Logger.info(`[Edit:::${key}] success ${isEdit}`)

  console.log('[Get:::]', { [key]: await get(RedisIo, key) })
  console.log('[Get TTL:::]', await getTTL(RedisIo, key))

  const isDel = await del(RedisIo, key)
  Logger.info(`[Del:::${key}] success ${isDel}`)

  const keys = ['adu', 'adu2', 'adu3']
  console.log('[Get Mutil:::]', await getMulti(RedisIo, keys))

  const isDelMutil = await del(RedisIo, keys)
  Logger.info(`[Del Mutil:::}] success ${isDelMutil}`)

  RedisIo.disconnect()
}

void test()
