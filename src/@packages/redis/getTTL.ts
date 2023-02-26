import { type RedisClientType } from 'redis'
import _formatKey from './_formatKey'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {redis.RedisClient} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */

async function getTTL(client: RedisClientType, key: string): Promise<number | null> {
  const redisKey = _formatKey(key)

  try {
    return await client.ttl(redisKey)
  } catch (error) {
    return null
  }
}

export default getTTL
