import type Redis from 'ioredis'
import _formatKey from './_formatKey'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */

async function get(client: Redis, key: string): Promise<string | null> {
  const redisKey = _formatKey(key)

  try {
    const redisValue = await client.get(redisKey)

    let value: any = null

    if (redisValue) {
      if (redisValue === 'NaN') {
        value = NaN
      } else {
        try {
          value = JSON.parse(redisValue)
        } catch (error) {
          value = redisValue
        }
      }
    }
    return value
  } catch (error) {
    return null
  }
}

export default get
