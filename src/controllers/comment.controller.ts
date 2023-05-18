import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'
import { CommentAction } from '../actions/comment.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'
import { type IContext } from '@hellocacbantre/context'

export class CommentController {
  private readonly context: IContext
  private readonly commentAction: CommentAction

  constructor(context: IContext) {
    this.commentAction = new CommentAction()
    this.context = context
  }

  createComment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      ...req.body,
      createdById: user?._id
    }
    const responses = await this.commentAction.createComment(this.context)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'create_comment', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  updateCommentById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      commentId: req.params.commentId,
      ...req.body
    }
    const responses = await this.commentAction.updateCommentById(this.context)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'update_comment', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  deleteCommentById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      commentId: req.params.commentId
    }
    const responses = await this.commentAction.deleteCommentById(this.context)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'delete_comment', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })
}
