import { AuthRole } from '@hellocacbantre/auth-role'
import { type IContext } from '@hellocacbantre/context'
import { type Request, type Response } from 'express'
import { CommentController } from '../controllers/comment.controller'
import { BaseRouter } from './base.router'

const ROUTER_NAME = 'comment'

export class CommentRouter extends BaseRouter {
  private readonly authRole: AuthRole
  private readonly controller: CommentController

  constructor(context: IContext) {
    super(context)
    this.controller = new CommentController(context)
    this.authRole = new AuthRole(context)
  }

  protected configureRoutes(): void {
    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })

    this.router.route('/create').post(this.authRole.isUserActive, this.controller.createComment)
    this.router
      .route('/update/:commentId')
      .put(this.authRole.isUser, this.controller.updateCommentById)
    this.router
      .route('/delete/:commentId')
      .delete(this.authRole.isUser, this.controller.deleteCommentById)
  }
}
