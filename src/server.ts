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
import mongooDbConnect from './databases/mongo.db'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import compression from 'compression'
import { RedisClient } from './databases/redis.db'
import { RedisIo } from './databases/redisio.db'
import PromiseBlueBird from './utils/bluebird'

async function connectDb(): Promise<void> {
  await PromiseBlueBird.all([
    mongooDbConnect(),
    import('./databases/redis.db'),
    import('./databases/redisio.db')
  ])
}

async function testRedis(): Promise<void> {
  await RedisClient.set('ping', 'pong', {
    EX: 10,
    NX: true
  })
  Logger.warn(`[Redis:::] ping ${await RedisClient.get('ping')}`)
}

async function testRedisIo(): Promise<void> {
  await RedisIo.set('ping_io', 'pong')
  Logger.warn(`[RedisIo:::] ping ${await RedisClient.get('ping_io')}`)
}

class Server {
  public app: express.Application = express()

  constructor() {
    this.app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 }))
    this.app.use(morgan('dev'))

    // set security HTTP headers
    this.app.use(helmet())

    // parse json request body
    this.app.use(express.json())

    // parse urlencoded request body
    this.app.use(express.urlencoded({ extended: true }))

    // sanitize request data
    this.app.use(xss())
    this.app.use(mongoSanitize())

    // gzip compression
    this.app.use(compression())

    this.app.use(
      responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
          restResponseTimeHistogram.observe({
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode
          }, time * 1000)
        }
      })
    )

    // enable cors
    this.app.use(
      cors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
      })
    )
    this.app.options('*', cors())

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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.app.listen(port, async () => {
      Logger.info(`[Server_Start:::] http://localhost:${port}/`)
      swaggerDocs(this.app, port)
      startMetricsServer()
      await connectDb()
      await testRedis()
      await testRedisIo()
    })
  }
}

// eslint-disable-next-line no-new
new Server()
