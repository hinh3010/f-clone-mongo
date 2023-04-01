import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'
import { CommentAction } from '../actions/comment.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export class CommentController {
  constructor(private readonly commentAction: CommentAction = new CommentAction()) {}

  createComment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      ...req.body,
      createdById: user?._id
    }
    const responses = await this.commentAction.createComment(req.headers)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'create_comment_by_post_id', success: 'true' })

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
    const responses = await this.commentAction.updateCommentById(req.headers)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'update_comment_by_id', success: 'true' })

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
    const responses = await this.commentAction.deleteCommentById(req.headers)(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'delete_comment_by_id', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })
}
