import { type Request, type Response, Router } from 'express'
import { CommentController } from '../controllers/comment.controller'
import AuthRole from '../middlewares/authRole'

const ROUTER_NAME = 'comment'

export class CommentRouter {
  public router: Router

  constructor(
    private readonly controller: CommentController = new CommentController(),
    private readonly authRole: AuthRole = new AuthRole()
  ) {
    this.router = Router()
    this.routes()
  }

  routes(): void {
    const { controller, authRole } = this

    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })

    this.router.route('/create').post(authRole.isUserActive, controller.createComment)
    this.router.route('/update/:commentId').put(authRole.isUser, controller.updateCommentById)
    this.router.route('/delete/:commentId').delete(authRole.isUser, controller.deleteCommentById)

    // this.router.route('/like/:id').post(controller.signUp)
    // this.router.route('/share/:id').post(controller.signUp)
  }
}
