import { type IContext } from '@hellocacbantre/context'
import { type IUser } from '@hellocacbantre/db-schemas'
import { type Request, type Response } from 'express'
import { GroupsAction } from '../actions/groups.action'
import catchAsync from '../middlewares/catchAsync'

export class GroupsController {
  private readonly postAction: GroupsAction

  constructor(context: IContext) {
    this.postAction = new GroupsAction(context)
  }

  createGroup = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      ...req.body,
      createdById: user?._id
    }

    const responses = await this.postAction.createGroup(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchGroups = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      ...req.query
    }
    const responses = await this.postAction.searchGroups(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  searchGroupById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      groupId: req.params.groupId,
      ...req.body
    }
    const responses = await this.postAction.searchGroupById(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  updateGroupById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      groupId: req.params.groupId,
      ...req.body
    }
    const responses = await this.postAction.updateGroupById(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })

  deleteGroupById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser

    const payload = {
      userRequestId: user?._id,
      groupId: req.params.groupId
    }
    const responses = await this.postAction.deleteGroupById(payload)

    return res.json({
      status: 200,
      data: responses
    })
  })
}
