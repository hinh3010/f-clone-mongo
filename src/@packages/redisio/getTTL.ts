import type Redis from 'ioredis'

/**
 * Lấy giá trị và thời gian hết hạn
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @returns {Promise<boolean>} - Promise trả về [any, any] | null
 */

async function getTTL(client: Redis, key: string): Promise<[any, any] | null> {
  try {
    const multi = client.multi()
    multi.get(key)
    multi.ttl(key)
    const results = await multi.exec()

    if (!results) {
      return null // Key not found
    }

    const ttl = results[1][1]

    let value: any = null

    if (results[0][1]) {
      if (results[0][1] === 'NaN') {
        value = NaN
      } else {
        try {
          value = typeof results[0][1] === 'string' ? JSON.parse(results[0][1]) : results[0][1]
        } catch (error) {
          value = results[0][1]
        }
      }
    }

    return [value, ttl]
  } catch (error) {
    return null
  }
}

export default getTTL
