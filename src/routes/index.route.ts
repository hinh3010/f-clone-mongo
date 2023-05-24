import { AttachmentsRouter } from '@hellocacbantre/attachments'
import { AuthRouter } from '@hellocacbantre/services-auth'
import { Router, type Request, type Response } from 'express'
import { Env } from '../config'
import { PostRouter } from './post.route'
// import { LikeRouter } from './like.route'
// import { TestsRouter } from './test.route'
// import { UserRouter } from './user.route'
import { type IContext } from '@hellocacbantre/context'
import { GroupsRouter } from './groups.route'
import { PagesRouter } from './pages.route'
import { CommentRouter } from './comment.route'

export class PlatformRouter {
  public routes: Router
  private readonly context: IContext

  //
  constructor(context: IContext) {
    this.context = context
    this.routes = Router()

    this.routes.use('/auth', new AuthRouter(this.context).getRouter())
    this.routes.use('/attachments', new AttachmentsRouter(this.context).getRouter())
    this.routes.use('/posts', new PostRouter(this.context).getRouter())
    this.routes.use('/groups', new GroupsRouter(this.context).getRouter())
    this.routes.use('/pages', new PagesRouter(this.context).getRouter())
    this.routes.use('/comments', new CommentRouter(this.context).getRouter())
    // this.routes.use('/tests', new TestsRouter(this.context).getRouter())
    // this.routes.use('/users', new UserRouter(this.context).getRouter())
    // this.routes.use('/likes', new LikeRouter(this.context).getRouter())

    this.routes.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${Env.SERVICE_NAME}`,
        context
      })
    })
  }
}
