import type Redis from 'ioredis'

/**
 * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string} key - Khóa
 * @param {any} value - Giá trị
 * @param {number} [expiration=null] - Thời gian hết hạn tính bằng giây, mặc định là không có thời gian hết hạn
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
async function set(client: Redis, key: string, value: any, expiration?: number): Promise<boolean> {
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
    const reply = expiration
      ? await client.set(
        key,
        redisValue,
        'EX',
        expiration, // Thời gian tồn tại
        'NX' // chỉ đặt giá trị của khóa nếu khóa không tồn tại.
      )
      : await client.set(
        key,
        redisValue,
        'NX'
      )
    return reply === 'OK'
  } catch (error) {
    return false
  }
}

export default set
