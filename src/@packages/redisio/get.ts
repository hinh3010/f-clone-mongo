import type Redis from 'ioredis'

/**
 * Lấy giá trị từ Redis
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @returns {Promise<string | null>} - Promise trả về string | null
 */

async function get(client: Redis, key: string): Promise<string | null> {
  try {
    const redisValue = await client.get(key)

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
