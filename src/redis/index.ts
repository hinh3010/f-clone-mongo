import { Env } from '../config'
import redisClient from '../databases/redis.db'

const { PROJECT_NAME, NODE_ENV } = Env
const defaultExpire = 300 // 5 minutes

const formatKey = (key: string | number): string => {
  let _key = key
  if (typeof key !== 'string') {
    _key = _key.toString()
  }
  return `${PROJECT_NAME}_${NODE_ENV}_${_key}`
}

const setJsonWithExpire = async (key: string | number, value: Record<string, unknown>, expire = defaultExpire): Promise<string | null> => {
  const redisKey = formatKey(key)
  return await redisClient.set(redisKey, JSON.stringify(value), {
    EX: expire,
    NX: true
  })
}

const setWithExpire = async (key: string | number, value: string, expire = defaultExpire): Promise<string | null> => {
  const redisKey = formatKey(key)
  return await redisClient.set(redisKey, value, {
    EX: expire
    // NX: true
  })
}

const setJsonNoExpire = async (key: string | number, value: Record<string, unknown>): Promise<string | null> => {
  const redisKey = formatKey(key)
  return await redisClient.set(redisKey, JSON.stringify(value))
}

const setNoExpire = async (key: string | number, value: string): Promise<string | null> => {
  const redisKey = formatKey(key)
  return await redisClient.set(redisKey, value)
}

const getJson = async (key: string | number): Promise<string | null> => {
  const redisKey = formatKey(key)
  const data = await redisClient.get(redisKey)
  return JSON.parse(data as string)
}

const get = async (key: string | number): Promise<string | null> => {
  const redisKey = formatKey(key)
  return await redisClient.get(redisKey)
}

const del = async (key: string | number): Promise<string | number | null> => {
  const redisKey = formatKey(key)
  return await redisClient.del(redisKey)
}

// const deleteMultipKey = async (key: string): Promise<string | null> => {
//   const redisKey = formatKey(key)
//   const keys = await redisClient.keys(redisKey)
//   const pipeline = redisClient.pipeline()
//   keys.forEach(function (key) {
//     pipeline.del(key)
//   })
//   return pipeline.exec()
// }

// const increment = async (key: string | number, incre = 1): Promise<string | null> => {
//   const redisKey = formatKey(key)
//   return redisClient.incrby(redisKey, incre)
// }

const redis = {
  setJsonWithExpire,
  setWithExpire,
  setJsonNoExpire,
  setNoExpire,
  getJson,
  get,
  del
  // deleteMultipKey,
  // increment
}

export default redis
