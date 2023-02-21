
import { type Request, type Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class TestsController {
  testApi = catchAsync(
    async (req: Request, res: Response) => {
      return res.json({ adu: 'adu' })
    }
  )
}
