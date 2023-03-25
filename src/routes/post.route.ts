import { type Request, type Response, Router } from 'express'
import { AuthController } from '../controllers/auth.controller'

const ROUTER_NAME = 'auth'

export class PostRouter {
  public router: Router

  constructor(private readonly authCtl: AuthController = new AuthController()) {
    this.router = Router()
    this.routes()
  }

  routes(): void {
    const { authCtl } = this

    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })
    this.router.route('/sign-in').post(authCtl.signIn)
    this.router.route('/sign-up').post(authCtl.signUp)
  }
}
