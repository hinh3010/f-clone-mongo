import type Redis from 'ioredis'

/**
 * Sửa giá trị vào Redis
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @param {any} value - Giá trị
 * @param {number} [expiration=null] - Thời gian hết hạn tính bằng giây, mặc định là không có thời gian hết hạn
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
async function edit(client: Redis, key: string, value: any, expiration?: number): Promise<boolean> {
  let redisValue: string

  if (typeof value === 'number' && isNaN(value)) {
    redisValue = 'NaN'
  } else {
    try {
      redisValue = JSON.stringify(value)
    } catch (e) {
      redisValue = value.toString()
    }
  }

  try {
    let reply: any
    if (expiration) {
      reply = await client.set(key, redisValue, 'EX', expiration, 'XX')
    } else {
      const ttl = await client.ttl(key)
      if (ttl > 0) {
        reply = await client.set(key, redisValue, 'EX', ttl, 'XX')
      } else {
        reply = await client.set(key, redisValue, 'XX')
      }
    }
    return reply === 'OK'
  } catch (error) {
    return false
  }
}

export default edit
