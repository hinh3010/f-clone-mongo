import { type Request, type Response, Router } from 'express'
import { testsRouter } from './test.route'

class IndexRouter {
  public routes: Router

  constructor() {
    this.routes = Router()
    this.routes.use('/tests', testsRouter)

    this.routes.use('/', (req: Request, res: Response) => {
      res.json({
        message: 'platform service'
      })
    })
  }
}

export const routes = new IndexRouter().routes
