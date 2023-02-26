import type Redis from 'ioredis'
import _formatKey from './_formatKey'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string | string[]} keys - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
async function del(client: Redis, keys: string | string[]): Promise<boolean> {
  let redisKeys: string[]

  if (typeof keys === 'string') {
    redisKeys = [_formatKey(keys)]
  } else {
    redisKeys = keys.map(key => _formatKey(key))
  }

  try {
    const result = await client.del(redisKeys)
    return !!result
  } catch (error) {
    return false
  }
}

export default del
