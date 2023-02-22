import express, { type Request, type Response } from 'express'
import client, { collectDefaultMetrics, register } from 'prom-client'
import Logger from '../@loggers/logger.pino'

const app = express()

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code']
})

export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success']
})

export function startMetricsServer(port = 9100): void {
  collectDefaultMetrics()

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get('/metrics', async (_: Request, res: Response) => {
    res.set('Content-Type', register.contentType)
    return res.send(await register.metrics())
  })

  app.listen(port, () => {
    Logger.info(`[Metrics_Start:::] http://localhost:${port}/metrics`)
  })
}
