import { type Request, type Response, Router } from 'express'
import { Env } from '../config'
import { testsRouter } from './test.route'

class IndexRouter {
  public routes: Router

  constructor() {
    this.routes = Router()
    this.routes.use('/tests', testsRouter)

    this.routes.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${Env.SERVICE_NAME}`
      })
    })
  }
}

export const routes = new IndexRouter().routes
