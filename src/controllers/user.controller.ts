import { type Request, type Response } from 'express'
import catchAsync from '../middlewares/catchAsync'

import { type IContext } from '@hellocacbantre/context'
import { type IUser } from '@hellocacbantre/db-schemas'
import { getStoreDb } from '../connections/mongo.db'

export class UserController {
  private readonly context: IContext
  constructor(context: IContext) {
    this.context = context
  }

  getListUser = catchAsync(async (req: Request, res: Response) => {
    const { getModel } = getStoreDb(this.context)
    const User = getModel<IUser>('User')
    const responses = await User.find().limit(5).lean()

    return res.json({
      status: 200,
      data: responses
    })
  })
}
