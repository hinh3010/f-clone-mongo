import { type Request, type Response } from 'express'
import catchAsync from '../middlewares/catchAsync'
import { User } from '../models/User'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export class UserController {
  getListUser = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_up', success: 'true' })

    console.log({ req: req.user })

    const responses = await User.find().limit(5).lean()

    return res.json({
      status: 200,
      data: responses
    })
  })

  login = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_up', success: 'true' })

    return res.json({
      status: 200,
      data: {
        user: req.user
      }
    })
  })
}
