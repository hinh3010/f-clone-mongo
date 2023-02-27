import { type Request, type Response, Router } from 'express'
import { TestsController } from '../controllers/tests.controller'
class TestsRouter {
  public router: Router

  constructor(
    private readonly testsCtl: TestsController = new TestsController()
  ) {
    this.router = Router()
    this.routes()
  }

  routes(): void {
    const { testsCtl } = this

    this.router.route('/tests')
      .get(testsCtl.testApi)

    this.router
      .get('/adu', testsCtl.testApi)
      .get('/adu2', testsCtl.testApi)

    this.router
      .get('/get-sesstion', (req: Request, res: Response) => {
        res.json({
          message: req.session
        })
      })

    this.router
      .get('/set-sesstion', (req: Request, res: Response) => {
        const user = {
          name: 'Hello cac ban tre',
          age: 23,
          email: 'hellobagia@gmail.com'
        }
        req.session.user = user
        res.json({
          message: req.session
        })
      })
  }
}

export const testsRouter = new TestsRouter().router
