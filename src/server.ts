import { type IContext } from '@hellocacbantre/context'
import express, { type Request, type Response, type Router } from 'express'
import 'reflect-metadata'
import Logger from './@loggers'
import { type IError } from './@types'
import { Env } from './config'
import { connectDb } from './connections/mongo.db'
import { PlatformRouter } from './routes/index.route'
import { serverLoader } from './server.loader'
import { getRedisClient } from './connections/redisio.db'

// import { startMetricsServer } from './utils/metrics'
// import swaggerDocs from './utils/swagger'

const handlerError = (err: IError, _: Request, res: Response, __: any) => {
  return res.json({
    status: err.status ?? 500,
    message: err.message
  })
}

class Server {
  public app: express.Application = express()
  readonly context: IContext = {
    mongoDb: {
      instance: connectDb(Env.MONGO_CONNECTION.URI, {
        ...Env.MONGO_CONNECTION.OPTIONS,
        dbName: 'platform'
      })
    },
    redisDb: {
      instance: getRedisClient(Env.REDIS_CONNECTION.URI)
    }
  }

  routes(): Router {
    return new PlatformRouter(this.context).routes
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      Logger.info(`[Server_Start:::] http://localhost:${port}/`)
      // swaggerDocs(this.app, port)
      // startMetricsServer(this.app, port)
    })
  }

  async start() {
    await serverLoader(this.context)(this.app)

    this.app.use(`/${Env.SERVICE_NAME}`, this.routes())

    this.app.get('/*', (_: Request, res: Response) => {
      res.json({
        message: `welcome service ${Env.SERVICE_NAME}`
      })
    })

    this.app.use(handlerError)

    this.listen(Number(Env.PORT))
  }
}

void (async () => {
  const server = new Server()
  await server.start()
})()
