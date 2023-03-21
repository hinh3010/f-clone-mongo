import { type Request, type Response } from 'express'
import { Redis } from '../packages'
import catchAsync from '../middlewares/catchAsync'
import { User } from '../models/User'
import { databaseResponseTimeHistogram } from '../utils/metrics'

async function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class UserController {
  getListUser = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_up', success: 'true' })

    const response = await Redis.get('adu')

    if (response) return res.json({ response })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      await sleep(4000)
      console.log('adu')
      const e = await Redis.edit('adu', { adu: 'adu' }, 600)
      console.log(e)
    }, 0)

    await Redis.set('adu', { ec: 'ec' }, 600)

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
