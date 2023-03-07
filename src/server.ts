import express, { type Request, type Response, type Router } from 'express'
import 'reflect-metadata'
import Logger from './@loggers/logger.pino'
import { Env } from './config'
import { routes } from './routes/index.route'
import { serverLoader } from './server.loader'
import { startMetricsServer } from './utils/metrics'
import swaggerDocs from './utils/swagger'

class Server {
  public app: express.Application = express()

  constructor() {
    void serverLoader(this.app)

    this.app.get('/', (_: Request, res: Response) => {
      res.json({
        message: `welcome service ${Env.SERVICE_NAME}`
      })
    })

    this.app.use('/platform', this.routes())

    this.app.use((err: { status: number, message: string }, _: Request, res: Response, __: any) => {
      res.json({
        status: err.status | 500,
        message: err.message
      })
    })

    this.listen(Number(Env.PORT))
  }

  routes(): Router {
    return routes
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      Logger.info(`[Server_Start:::] http://localhost:${port}/`)
      swaggerDocs(this.app, port)
      startMetricsServer(this.app, port)
    })
  }
}

// eslint-disable-next-line no-new
new Server()
