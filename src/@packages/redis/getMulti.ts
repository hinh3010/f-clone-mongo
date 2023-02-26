import { type RedisClientType } from 'redis'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {redis.RedisClient} client - Đối tượng RedisClient
 * @param {string[]} keys - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */

async function getMulti(client: RedisClientType, keys: string[]): Promise<string | null> {
  try {
    const redisValues = await client.mGet(keys)

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
