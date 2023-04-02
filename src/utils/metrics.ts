import { type Application, type Request, type Response } from 'express'
import client, { collectDefaultMetrics, register } from 'prom-client'
import Logger from '../@loggers'

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

export function startMetricsServer(app: Application, port: number): void {
  collectDefaultMetrics()

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.get('/metrics', async (_: Request, res: Response) => {
    res.set('Content-Type', register.contentType)
    return res.send(await register.metrics())
  })

  Logger.info(`[Metrics_Start:::] http://localhost:${port}/metrics`)
}
