import { type IContext } from '@hellocacbantre/context'
import compression from 'compression'
import connectRedis from 'connect-redis'
import cors from 'cors'
import express, { type Request, type Response } from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import session from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'
import passport from 'passport'
import path from 'path'
import responseTime from 'response-time'
import xss from 'xss-clean'
import { Env, getGlobalSetting } from './config'
import { restResponseTimeHistogram } from './utils/metrics'

const RedisStore = connectRedis(session)

export function serverLoader(context: IContext) {
  return async (app: express.Application): Promise<void> => {
    app.use(
      express.static(path.join(__dirname, '..', 'public'), {
        maxAge: 31557600000
      })
    )
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
    const sessionSecret = await getGlobalSetting(context)('session_secret')

    app.use(
      session({
        secret: sessionSecret ?? 'hellocacbantre',
        resave: false, // xác định liệu session có được lưu trữ lại trong cơ sở dữ liệu mỗi khi có yêu cầu hay không
        saveUninitialized: true, // true/false, xác định liệu session có được lưu trữ khi chưa có dữ liệu được lưu trữ trong session hay không
        store: new RedisStore({ client: context.redisDb.instance }),
        cookie: {
          secure: Env.NODE_ENV === 'production', // Determines whether cookies are sent over HTTPS
          httpOnly: true,
          maxAge: 5 * 60 * 1000 // Cookie lifetime, in milliseconds. // 5 minutes
          // path: "Đường dẫn của cookie, mặc định là '/'",
          // expires: 'The expiration date of a cookie, represented as a Date object'
        }
      })
    )

    // passport
    app.use(passport.initialize())
  }
}
