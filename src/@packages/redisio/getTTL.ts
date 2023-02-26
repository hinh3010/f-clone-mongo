import type Redis from 'ioredis'
import _formatKey from './_formatKey'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */

async function getTTL(client: Redis, key: string): Promise<any> {
  const redisKey = _formatKey(key)

  try {
    const multi = client.multi()
    multi.get(redisKey)
    multi.ttl(redisKey)
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
