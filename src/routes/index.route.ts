import { Router, type Request, type Response } from 'express'
import { Env } from '../config'
import { AuthRouter } from './auth.route'
import { PostRouter } from './post.route'
import { TestsRouter } from './test.route'
import { UserRouter } from './user.route'

export class PlatformRouter {
  public routes: Router

  constructor() {
    this.routes = Router()
    this.routes.use('/tests', new TestsRouter().router)
    this.routes.use('/auth', new AuthRouter().router)
    this.routes.use('/auth', new PostRouter().router)
    this.routes.use('/users', new UserRouter().router)

    this.routes.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${Env.SERVICE_NAME}`
      })
    })
  }
}
