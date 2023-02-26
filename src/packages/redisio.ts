import { RedisIo } from '../@packages'
import { Env } from '../config'
import { RedisIoClient } from '../databases/redisio.db'

const _formatKey = (key: string): string => {
  const serviceName = Env.SERVICE_NAME
  const nodeEnv = Env.NODE_ENV

  return (serviceName && nodeEnv)
    ? `${serviceName}_${nodeEnv}_${key}`
    : 'local_' + key
}

console.log(_formatKey)
console.log(RedisIo)

const set = async (key: string, value: any, expiration?: number) => {
  return await RedisIo.set(RedisIoClient, _formatKey(key), value, expiration)
}
