import cors from 'cors'
import express, { type Request, type Response, type Router } from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import { routes } from './routes/index.route'
import { Env } from './config'
import path from 'path'

class Server {
  public app: express.Application = express()

  constructor() {
    this.app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: 31557600000 }))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(morgan('dev'))

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
      console.log(
        `http://localhost:${port}/`
      )
    })
  }
}

// eslint-disable-next-line no-new
new Server()
