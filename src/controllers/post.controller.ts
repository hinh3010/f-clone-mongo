import { type IContext } from '@hellocacbantre/context'
import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'
import { PostAction } from '../actions/post.action'
import catchAsync from '../middlewares/catchAsync'

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

    const responses = await this.postAction.createPost(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  newsFeed = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      ...req.query
    }
    const responses = await this.postAction.searchNewsFeed(payload)

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

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchPostById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      postId: req.params.postId
    }
    const responses = await this.postAction.searchPostById(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchPosts = catchAsync(async (req: Request, res: Response) => {
    const payload = {
      ...req.body
    }
    const responses = await this.postAction.searchPosts(payload)

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

    return res.json({
      status: 200,
      data: responses
    })
  })
}
