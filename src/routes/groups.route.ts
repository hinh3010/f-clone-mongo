import { AuthRole } from '@hellocacbantre/auth-role'
import { type IContext } from '@hellocacbantre/context'
import { type Request, type Response } from 'express'
import { GroupsController } from '../controllers/groups.controller'
import { BaseRouter } from './base.router'

const ROUTER_NAME = 'groups'

export class GroupsRouter extends BaseRouter {
  private readonly authRole: AuthRole
  private readonly controller: GroupsController

  constructor(context: IContext) {
    super(context)
    this.controller = new GroupsController(context)
    this.authRole = new AuthRole(context)
  }

  protected configureRoutes(): void {
    const { controller, authRole } = this

    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })
    this.router.route('/create').post(authRole.isUser, controller.createGroup)
    this.router.route('/search').get(authRole.isUser, controller.searchGroups)
    this.router.route('/search/:groupId').get(authRole.isUser, controller.searchGroupById)
    this.router.route('/update/:groupId').put(authRole.isUser, controller.updateGroupById)
    this.router.route('/delete/:groupId').delete(authRole.isUser, controller.deleteGroupById)
  }
}
