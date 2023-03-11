import Jwt, { type SignOptions } from 'jsonwebtoken'
import { Env } from '../config'
import createError from 'http-errors'
import { type NextFunction, type Request, type Response } from 'express'

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES
} = Env.JWT

export class JwtService {
  async generateAccessToken(payload: object): Promise<string | unknown> {
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

  async generateRefreshToken(payload: object): Promise<string | unknown> {
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

  async verifyAccessToken(req: Request, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next(createError.Unauthorized())
      return
    }
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    if (!token) {
      next(createError.Unauthorized())
      return
    }
    Jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          next(createError.Unauthorized())
          return
        }
        next(createError.Unauthorized(err.message))
        return
      }
      req.body = {
        ...req.body,
        payload
      }
      next()
    })
  }

  //   async verifyRefreshToken(refreshToken: string) {
  //     return new Promise((resolve, reject) => {
  //       if (!refreshToken) {
  //         reject(createError.BadRequest())
  //       }
  //       Jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
  //         if (err) reject(err)
  //         resolve(payload)
  //       })
  //     })
  //   }

  async verifyRefreshToken(req: Request, _: Response, next: NextFunction) {
    const refreshToken = req.cookies
      .split('; ')
      .find((row: string) => row.startsWith('refresh_token='))
      .split('=')[1]

    if (!refreshToken) {
      next(createError.BadRequest())
    }
    Jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, payload: any) => {
      if (err) next(err)
      return payload
    })
  }
}
