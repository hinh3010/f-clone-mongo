import { type Request } from 'express'

declare module 'express' {
  interface CustomRequest extends Request {
    userId?: string
  }
}
