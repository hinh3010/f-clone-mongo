import { Router } from 'express'
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
  }
}

export const testsRouter = new TestsRouter().router
