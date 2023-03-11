import { type NextFunction, type Request, type Response } from 'express'
import Logger from '../@loggers/logger.pino'
import { type IError } from '../@types'

const catchAsync =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: IError) => {
      const { message, status } = err
      Logger.error(`
        [${new Date().toLocaleString()}] 
        Incoming ${req.method}${req.originalUrl} 
        Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}
        
        Message "${message}"
        Status "${status || 500}"
      `)
      next(err)
    })
  }

export default catchAsync
