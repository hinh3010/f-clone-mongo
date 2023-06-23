import { TestsController } from '../controllers/tests.controller'
import { type IContext } from '@hellocacbantre/context'
import { BaseRouter } from './base.router'

export class TestsRouter extends BaseRouter {
  private readonly testsCtl: TestsController

  constructor(context: IContext) {
    super(context)
    this.testsCtl = new TestsController()
  }

  protected configureRoutes(): void {
    this.router.route('/tests').get(this.testsCtl.testApi)
  }
}
