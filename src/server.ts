import cors from 'cors'
import express, { type Request, type Response, type Router } from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import { routes } from './routes/index.route'
import { Env } from './config'
import path from 'path'
import Logger from './@loggers/logger.pino'
import { restResponseTimeHistogram, startMetricsServer } from './utils/metrics'
import responseTime from 'response-time'
import swaggerDocs from './utils/swagger'

class Server {
  public app: express.Application = express()

  constructor() {
    this.app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 }))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(morgan('dev'))

    this.app.use(
      responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
          restResponseTimeHistogram.observe(
            {
              method: req.method,
              route: req.route.path,
              status_code: res.statusCode
            },
            time * 1000
          )
        }
      })
    )

    this.app.use(
      cors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
      })
    )

    this.app.get('/', (_: Request, res: Response) => {
      res.json({
        message: 'hello cac ban tre'
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
      startMetricsServer()
    })
  }
}

// eslint-disable-next-line no-new
new Server()
