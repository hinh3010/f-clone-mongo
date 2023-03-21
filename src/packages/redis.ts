import { RedisIo } from '../@packages'
import { Env } from '../config'
import { RedisIoClient } from '../databases/redisio.db'

const _formatKey = (key: string): string => {
  const serviceName = Env.SERVICE_NAME
  const nodeEnv = Env.NODE_ENV

  return serviceName && nodeEnv ? `${serviceName}_${key}` : key
}

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {string} key - Khóa
 * @param {any} value - Giá trị
 * @param {number} [expiration=null] - Thời gian hết hạn tính bằng giây, mặc định là không có thời gian hết hạn
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
const set = async (
  key: string,
  value: any,
  expiration?: number
): Promise<boolean> => {
  const redisKeys = _formatKey(key)
  return await RedisIo.set(RedisIoClient, redisKeys, value, expiration)
}

/**
 * Lấy giá trị từ Redis
 * @param {string} key - Khóa
 * @returns {Promise<string | null>} - Promise trả về string | null
 */
const get = async (key: string): Promise<string | null> => {
  const redisKeys = _formatKey(key)
  return await RedisIo.get(RedisIoClient, redisKeys)
}

/**
 * Sửa giá trị vào Redis
 * @param {string} key - Khóa
 * @param {any} value - Giá trị
 * @param {number} [expiration=null] - Thời gian hết hạn tính bằng giây, mặc định là không có thời gian hết hạn
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
const edit = async (
  key: string,
  value: any,
  expiration?: number
): Promise<boolean> => {
  const redisKeys = _formatKey(key)
  return await RedisIo.edit(RedisIoClient, redisKeys, value, expiration)
}

/**
 * Xóa các khóa Redis được chỉ định khỏi cơ sở dữ liệu.
 * @param {string | string[]} keys - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
const del = async (keys: string | string[]): Promise<boolean> => {
  const redisKeys =
    typeof keys === 'string'
      ? _formatKey(keys)
      : keys.map((key) => _formatKey(key))
  return await RedisIo.del(RedisIoClient, redisKeys)
}

/**
 * Lấy giá trị và thời gian hết hạn
 * @param {string} key - Khóa
 * @returns {Promise<boolean>} - Promise trả về [any, any] | null
 */
const getTTL = async (key: string): Promise<[any, any] | null> => {
  return await RedisIo.getTTL(RedisIoClient, _formatKey(key))
}

/**
 * Lấy nhiểu giá trị từ Redis
 * @param {string[]} keys - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
const getMulti = async (keys: string[]): Promise<string | null> => {
  const redisKeys = keys.map((key) => _formatKey(key))
  return await RedisIo.getMulti(RedisIoClient, redisKeys)
}

export default {
  set,
  get,
  getMulti,
  getTTL,
  del,
  edit
}
