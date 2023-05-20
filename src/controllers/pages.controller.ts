import { type IContext } from '@hellocacbantre/context'
import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'
import { PagesAction } from '../actions/pages.action'
import catchAsync from '../middlewares/catchAsync'

export class PagesController {
  private readonly postAction: PagesAction

  constructor(context: IContext) {
    this.postAction = new PagesAction(context)
  }

  createPage = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      ...req.body,
      createdById: user?._id
    }

    const responses = await this.postAction.createPage(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchPages = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      ...req.query
    }
    const responses = await this.postAction.searchPages(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchPageById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      pageId: req.params.pageId,
      ...req.body
    }
    const responses = await this.postAction.searchPageById(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  updatePageById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      pageId: req.params.pageId,
      ...req.body
    }
    const responses = await this.postAction.updatePageById(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  deletePageById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      pageId: req.params.pageId
    }
    const responses = await this.postAction.deletePageById(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })
}
