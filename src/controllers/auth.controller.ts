import { type Request, type Response } from 'express'
import { AuthAction } from '../actions/auth.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export class AuthController {
  constructor(private readonly authAction: AuthAction = new AuthAction()) {}

  signUp = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_up', success: 'true' })

    const responses = await this.authAction.signUp()(req.body)

    return res.json({
      status: 200,
      data: responses
    })
  })

  signIn = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_in', success: 'true' })
    const responses = await this.authAction.signIn()(req.body)

    return res.json({
      status: 200,
      data: responses
    })
  })
}
