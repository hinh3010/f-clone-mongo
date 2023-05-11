import { Router, type Request, type Response } from 'express'
import { Env } from '../config'
import { AuthRouter } from './auth.route'
import { CommentRouter } from './comment.route'
import { LikeRouter } from './like.route'
import { PostRouter } from './post.route'
import { TestsRouter } from './test.route'
import { UserRouter } from './user.route'
import { type IContext } from '@hellocacbantre/context'

export class PlatformRouter {
  public routes: Router
  private readonly context: IContext

  //
  constructor(context: IContext) {
    this.context = context
    this.routes = Router()

    this.routes.use('/tests', new TestsRouter().router)
    this.routes.use('/auth', new AuthRouter().router)
    this.routes.use('/users', new UserRouter().router)
    this.routes.use('/posts', new PostRouter().router)
    this.routes.use('/comments', new CommentRouter().router)
    this.routes.use('/likes', new LikeRouter().router)

    this.routes.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${Env.SERVICE_NAME}`,
        context
      })
    })
  }
}
