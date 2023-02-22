import { type NextFunction, type Request, type Response } from 'express'

const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next))
    .catch((err: { status: number, message: string }) => {
      console.error(`
        [${new Date().toLocaleString()}] 
        Incoming ${req.method}${req.originalUrl} 
        Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}
        
        Message "${err.message}"
        Status "${err.status | 500}"
      `)
      next(err)
    })
}

export default catchAsync