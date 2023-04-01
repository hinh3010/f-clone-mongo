import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'
import { LikeAction } from '../actions/like.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export class LikeController {
  constructor(private readonly likeAction: LikeAction = new LikeAction()) {}

  like = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      ...req.body,
      createdById: user?._id
    }
    const responses = await this.likeAction.like(req.headers)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'like', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  dislike = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      ...req.body,
      createdById: user?._id
    }
    const responses = await this.likeAction.like(req.headers)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'dislike', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })
}
