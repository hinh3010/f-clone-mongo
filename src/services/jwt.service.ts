import CryptoJS from 'crypto-js'
import Jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { type ObjectId } from 'mongoose'
import { Env } from '../config'

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } =
  Env.JWT

const privateKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex)
const publicKey = CryptoJS.SHA256(privateKey).toString()
console.log(publicKey)

export interface IPayload extends JwtPayload {
  _id: ObjectId
}

export class JwtService {
  async generateAccessToken(payload: IPayload): Promise<string | unknown> {
    return new Promise((resolve, reject) => {
      const serret = ACCESS_TOKEN_SECRET
      const options: SignOptions = {
        expiresIn: ACCESS_TOKEN_EXPIRES,
        algorithm: 'HS256',
        subject: 'authentication'
      }
      Jwt.sign(payload, serret, options, (err, token) => {
        if (err) reject(err)
        resolve(token)
      })
    })
  }

  async generateRefreshToken(payload: IPayload): Promise<string | unknown> {
    const serret = REFRESH_TOKEN_SECRET
    const options: SignOptions = {
      expiresIn: REFRESH_TOKEN_EXPIRES,
      algorithm: 'HS256',
      subject: 'authentication'
    }
    try {
      return Jwt.sign(payload, serret, options)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async verifyAccessToken(token: string) {
    return Jwt.verify(token, ACCESS_TOKEN_SECRET)
  }

  async verifyRefreshToken(refreshToken: string) {
    return Jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
  }
}
