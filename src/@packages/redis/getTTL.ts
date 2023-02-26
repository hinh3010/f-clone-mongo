import { type RedisClientType } from 'redis'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {redis.RedisClient} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */

async function getTTL(client: RedisClientType, key: string): Promise<number | null> {
  try {
    return await client.ttl(key)
  } catch (error) {
    return null
  }
}

export default getTTL
