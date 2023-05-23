import { AuthRole } from '@hellocacbantre/auth-role'
import { type IContext } from '@hellocacbantre/context'
import { type Request, type Response } from 'express'
import { BaseRouter } from './base.router'
import { PagesController } from '../controllers/pages.controller'

const ROUTER_NAME = 'pages'

export class PagesRouter extends BaseRouter {
  private readonly authRole: AuthRole
  private readonly controller: PagesController

  constructor(context: IContext) {
    super(context)
    this.controller = new PagesController(context)
    this.authRole = new AuthRole(context)
  }

  protected configureRoutes(): void {
    const { controller, authRole } = this

    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })
    this.router.route('/create').post(authRole.isUser, controller.createPage)
    this.router.route('/search').get(authRole.isUser, controller.searchPages)
    this.router.route('/search/:pageId').get(authRole.isUser, controller.searchPageById)
    this.router.route('/update/:pageId').put(authRole.isUser, controller.updatePageById)
    this.router.route('/delete/:pageId').delete(authRole.isUser, controller.deletePageById)
  }
}
