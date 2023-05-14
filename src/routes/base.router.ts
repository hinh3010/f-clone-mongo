import { Router } from 'express'
import { type IContext } from '@hellocacbantre/context'

export abstract class BaseRouter {
  protected readonly router: Router
  protected readonly context: IContext

  constructor(context: IContext) {
    this.router = Router()
    this.context = context
    // this.configureRoutes()
  }

  protected abstract configureRoutes(): void

  public getRouter(): Router {
    this.configureRoutes()
    return this.router
  }
}
