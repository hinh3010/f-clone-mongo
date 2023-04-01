import { type Request, type Response, Router } from 'express'
import { LikeController } from '../controllers/like.controller'
import AuthRole from '../middlewares/authRole'

const ROUTER_NAME = 'like'

export class LikeRouter {
  public router: Router

  constructor(
    private readonly controller: LikeController = new LikeController(),
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

    this.router.route('/like').post(authRole.isUserActive, controller.like)
    this.router.route('/dislike').delete(authRole.isUser, controller.dislike)
  }
}
