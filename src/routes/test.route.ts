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
    this.router.route('/tests')
      .get(this.testsCtl.testApi)

    this.router
      .get('/adu', this.testsCtl.testApi)
      .get('/adu2', this.testsCtl.testApi)
  }
}

export const testsRouter = new TestsRouter().router
