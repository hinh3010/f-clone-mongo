import type Redis from 'ioredis'
import _formatKey from './_formatKey'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string[]} keys - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */

async function getMulti(client: Redis, keys: string[]): Promise<string | null> {
  const redisKeys = keys.map(key => _formatKey(key))
  try {
    console.log({ keys })
    console.log({ redisKeys })
    const redisValues = await client.mget(redisKeys)
    console.log({ redisValues })
    let values: any = null

    if (redisValues && redisValues.length > 0) {
      values = redisValues.map(value => {
        if (value) {
          if (value === 'NaN') return NaN
          else {
            try {
              return JSON.parse(value)
            } catch (error) {
              return value
            }
          }
        } else return null
      })
    }
    return values
  } catch (error) {
    return null
  }
}

export default getMulti
