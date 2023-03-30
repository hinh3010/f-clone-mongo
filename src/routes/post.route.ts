import { type Request, type Response, Router } from 'express'
import { PostController } from '../controllers/post.controller'
import AuthRole from '../middlewares/authRole'

const ROUTER_NAME = 'posts'

export class PostRouter {
  public router: Router

  constructor(
    private readonly controller: PostController = new PostController(),
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
    this.router.route('/create').post(authRole.isUserActive, controller.createPost)
    this.router.route('/posts').post(authRole.isUser, controller.searchPosts)
    this.router.route('/posts/:userId').post(authRole.isUserActive, controller.searchPostsByUserId)
    this.router.route('/news-feed').post(authRole.isUser, controller.newsFeed)
    this.router.route('/post/:postId').post(authRole.isUser, controller.searchPostById)
    this.router.route('/update/:postId').put(authRole.isUser, controller.updatePostById)
    this.router.route('/delete/:postId').delete(authRole.isUser, controller.deletePostById)
    // this.router.route('/like/:id').post(controller.signUp)
    // this.router.route('/share/:id').post(controller.signUp)
  }
}
