
import { type Request, type Response } from 'express'
import catchAsync from '../middlewares/catchAsync'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export class TestsController {
  testApi = catchAsync(
    async (req: Request, res: Response) => {
      const timer = databaseResponseTimeHistogram.startTimer()
      timer({ operation: 'test', success: 'true' })
      return res.json({ adu: 'adu' })
    }
  )
}
