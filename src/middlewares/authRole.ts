import { type NextFunction, type Request, type Response } from 'express'
import createError from 'http-errors'
import catchAsync from '../middlewares/catchAsync'
import { JwtService } from '../services/jwt.service'

import { getModel } from '../models'
import { type IUser } from '@hellocacbantre/db-schemas'
import { ROLES_TYPE } from '@hellocacbantre/db-schemas/dist/enums/user.enum'

class AuthRole {
  constructor(private readonly jwtService: JwtService = new JwtService()) {}

  isUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  })

  isAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      const { roles = [] } = user

      if (!roles.includes(ROLES_TYPE.Admin)) {
        return next(createError.Forbidden('You do not have permission'))
      }

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  })

  isSuperAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      const { roles = [] } = user

      if (!roles.includes(ROLES_TYPE.SuperAdmin)) {
        return next(createError.Forbidden('You do not have permission'))
      }

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  })

  isValid = catchAsync(
    (req: Request, res: Response, next: NextFunction) => async (role: ROLES_TYPE) => {
      const { authorization } = req.headers
      if (authorization) {
        const token = authorization.split(' ')[1]
        if (!token) {
          return next(createError.Unauthorized())
        }
        const decoded: any = await this.jwtService.verifyAccessToken(token)

        const User = getModel<IUser>('User')
        const user = await User.findById(decoded._id).lean()

        const { roles = [] } = user

        if (!roles.includes(role)) {
          return next(createError.Forbidden('You do not have permission'))
        }

        req.user = user

        return next()
      }
      return next(createError.Unauthorized())
    }
  )
}

export default AuthRole
