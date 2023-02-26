import { type RedisClientType } from 'redis'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {redis.RedisClient} client - Đối tượng RedisClient
 * @param {string | string[]} keys - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
async function del(client: RedisClientType, keys: string | string[]): Promise<boolean> {
  const redisKeys: string[] = (typeof keys === 'string') ? [keys] : keys

  try {
    const result = await client.del(redisKeys)
    return !!result
  } catch (error) {
    return false
  }
}

export default del
