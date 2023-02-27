import compression from 'compression'
import cors from 'cors'
import express, { type Request, type Response } from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import session from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import responseTime from 'response-time'
import xss from 'xss-clean'
import { Env } from './config'
import mongooDbConnect from './databases/mongo.db'
import PromiseBlueBird from './utils/bluebird'
import { restResponseTimeHistogram } from './utils/metrics'

async function connectDb(): Promise<void> {
  await PromiseBlueBird.all([
    mongooDbConnect(),
    import('./databases/redis.db'),
    import('./databases/redisio.db')
  ])
}

export async function serverLoader(app: express.Application): Promise<void> {
  app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 }))
  app.use(morgan('dev'))

  // set security HTTP headers
  app.use(helmet())

  // parse json request body
  app.use(express.json())

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }))

  // sanitize request data
  app.use(xss())
  app.use(mongoSanitize())

  // gzip compression
  app.use(compression())

  // metrics data
  app.use(
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
  app.use(
    cors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true
    })
  )
  app.options('*', cors())

  // trust first proxy
  if (Env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
  }

  // session
  app.use(session({
    secret: 'keyboard cat',
    resave: false, // true: reset cookies for every request if expired
    saveUninitialized: true,
    cookie: {
      secure: Env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 5 * 60 * 1000 // 5 minutes time expiration
    }
  }))

  await connectDb()
}
