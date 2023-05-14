import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'
import { PostAction } from '../actions/post.action'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'
import { type IContext } from '@hellocacbantre/context'

export class PostController {
  private readonly postAction: PostAction

  constructor(context: IContext) {
    this.postAction = new PostAction(context)
  }

  createPost = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      ...req.body,
      createdById: user?._id
    }
    console.log(
      '🚀 ~ file: post.controller.ts:19 ~ PostController ~ createPost=catchAsync ~ payload:',

      payload
    )
    const responses = await this.postAction.createPost(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'create_post', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchPosts = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      ...req.body
    }
    const responses = await this.postAction.searchPosts(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'search_posts', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchPostsByUserId = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userTargetId: req.params.userId,
      userRequestId: user?._id,
      ...req.body
    }
    const responses = await this.postAction.searchPostsByUserId(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'search_posts_by_user_' + req.params.userId, success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  newsFeed = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      ...req.body
    }
    const responses = await this.postAction.searchNewsFeed(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'news_feed', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchPostById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      postId: req.params.postId,
      ...req.body
    }
    const responses = await this.postAction.searchPostById(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'post_by_id', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  updatePostById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      postId: req.params.postId,
      ...req.body
    }
    const responses = await this.postAction.updatePostById(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'update_post_by_id', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })

  deletePostById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      postId: req.params.postId
    }
    const responses = await this.postAction.deletePostById(payload)

    const timer = databaseResponseTimeHistogram.startTimer()
    timer({ operation: 'delete_post_by_id', success: 'true' })

    return res.json({
      status: 200,
      data: responses
    })
  })
}
