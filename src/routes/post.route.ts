import { AuthRole } from '@hellocacbantre/auth-role'
import { type IContext } from '@hellocacbantre/context'
import { type Request, type Response } from 'express'
import { PostController } from '../controllers/post.controller'
import { BaseRouter } from './base.router'

const ROUTER_NAME = 'posts'

export class PostRouter extends BaseRouter {
  private readonly authRole: AuthRole
  private readonly controller: PostController

  constructor(context: IContext) {
    super(context)
    this.controller = new PostController(context)
    this.authRole = new AuthRole(context)
  }

  protected configureRoutes(): void {
    const { controller, authRole } = this

    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })
    this.router.route('/news-feed').get(authRole.isUser, controller.newsFeed)
    this.router.route('/create').post(authRole.isUser, controller.createPost)
    this.router.route('/posts/:userId').post(authRole.isUser, controller.searchPostsByUserId)
    this.router.route('/post/:postId').get(authRole.isUser, controller.searchPostById)
    this.router.route('/update/:postId').put(authRole.isUser, controller.updatePostById)
    this.router.route('/delete/:postId').delete(authRole.isUser, controller.deletePostById)
    // this.router.route('/like/:id').post(controller.signUp)
    // this.router.route('/share/:id').post(controller.signUp)
  }
}
