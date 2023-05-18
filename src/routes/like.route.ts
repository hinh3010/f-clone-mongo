import { AuthRole } from '@hellocacbantre/auth-role'
import { type IContext } from '@hellocacbantre/context'
import { type Request, type Response } from 'express'
import { LikeController } from '../controllers/like.controller'
import { BaseRouter } from './base.router'

const ROUTER_NAME = 'like'

export class LikeRouter extends BaseRouter {
  private readonly authRole: AuthRole
  private readonly controller: LikeController

  constructor(context: IContext) {
    super(context)
    this.controller = new LikeController(context)
    this.authRole = new AuthRole(context)
  }

  protected configureRoutes(): void {
    const { controller, authRole } = this

    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })

    this.router.route('/like').post(authRole.isUserActive, controller.like)
    this.router.route('/dislike').delete(authRole.isUser, controller.dislike)
  }
}
