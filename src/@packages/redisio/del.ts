import type Redis from 'ioredis'

/**
 * Xóa các khóa Redis được chỉ định khỏi cơ sở dữ liệu.
 * @param {Redis} client - Đối tượng RedisClient
 * @param {string | string[]} keys - Khóa
 * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
 */
async function del(client: Redis, keys: string | string[]): Promise<boolean> {
  const redisKeys: string[] = (typeof keys === 'string') ? [keys] : keys

  try {
    const result = await client.del(redisKeys)
    return !!result
  } catch (error) {
    return false
  }
}

// /**
//  * Xóa các khóa Redis được chỉ định khỏi cơ sở dữ liệu.
//  * @param {Redis} client - Đối tượng Redis client để thực hiện lệnh xóa.
//  * @returns {Promise<(keys: string | string[]) => Promise<boolean>>} - Hàm trả về một Promise có giá trị là true nếu xóa thành công, và false nếu không thành công.
//  * @throws {Error} - Nếu có lỗi xảy ra khi thực hiện lệnh xóa.
//  */
// const del = async (client: Redis): Promise<(keys: string | string[]) => Promise<boolean>> => {
//   /**
//    * Lưu trữ giá trị vào Redis với tùy chọn thời gian hết hạn
//    * @param {string | string[]} keys - Khóa
//    * @returns {Promise<boolean>} - Promise trả về true nếu lưu trữ thành công, ngược lại trả về false
//    */
//   return async (keys: string | string[]): Promise<boolean> => {
//     const redisKeys: string[] = (typeof keys === 'string') ? [keys] : keys

//     try {
//       const result = await client.del(redisKeys)
//       return !!result
//     } catch (error) {
//       return false
//     }
//   }
// }

export default del
