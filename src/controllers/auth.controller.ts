import { type Request, type Response } from 'express'
import { AuthAction } from '../actions/auth.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export class AuthController {
  constructor(private readonly authAction: AuthAction = new AuthAction()) {}

  signUp = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'test', success: 'true' })

    const newUser = await this.authAction.signUp(req.body)

    return res.json({
      status: 200,
      data: newUser
    })
  })

  signIn = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'test', success: 'true' })
    return res.json({ adu: 'signIn' })
  })

  signOut = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'test', success: 'true' })
    return res.json({ adu: 'signOut' })
  })
}
