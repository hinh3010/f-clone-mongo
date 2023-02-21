import { Router } from 'express'
import { testsRouter } from './test.route'

class IndexRouter {
  public routes: Router

  constructor() {
    this.routes = Router()
    this.routes.use('/tests', testsRouter)
  }
}

export const routes = new IndexRouter().routes
