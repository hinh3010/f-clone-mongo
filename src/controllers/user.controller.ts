import { type Request, type Response } from 'express'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'

import { type IUser } from '@hellocacbantre/db-schemas'
import { falcol } from '../connections/redisio.db'
import { getModel } from '../models'

async function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class UserController {
  getListUser = catchAsync(async (req: Request, res: Response) => {
    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'auth_sign_up', success: 'true' })

    const response = await falcol.get('adu')

    if (response) return res.json({ response })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      await sleep(4000)
      console.log('adu')
      const e = await falcol.setJSON('adu', { adu: 'adu' })
      await falcol.expire('adu', 600)
      console.log(e)
    }, 0)

    await falcol.setJSON('adu', { ec: 'ec' })
    await falcol.expire('adu', 600)

    const User = getModel<IUser>('User')
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
