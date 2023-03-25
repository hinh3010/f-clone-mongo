/* eslint-disable @typescript-eslint/no-misused-promises */
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import express, { type Application } from 'express'

/**
 * Initialize Sentry and Tracing.
 * @param dsn - The Sentry DSN.
 * @param app - The Express application.
 */
function initSentry(dsn: string, app: Application): void {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
      new Tracing.Integrations.Mongo({ useMongoose: true })
    ],
    tracesSampleRate: 1.0
  })
}

/**
 * Trace a custom transaction.
 * @param name - The name of the transaction.
 * @param fn - The function to execute within the transaction.
 * @returns The result of the function.
 */
async function traceTransaction<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const transaction = Sentry.startTransaction({ op: 'transaction', name })
  try {
    const result = await fn()
    transaction.finish()
    return result
  } catch (error) {
    transaction.finish()
    throw error
  }
}

// Example usage
const app: express.Application = express()
initSentry('YOUR_SENTRY_DSN', app)

app.get('/test', async (req, res) => {
  await traceTransaction('test', async () => {
    // Your code here
    res.send('Test')
  })
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
app.use(Sentry.Handlers.tracingHandler())
app.get('/', (req, res) => {
  const user = { id: 1, name: 'John Doe' }
  Sentry.withScope((scope) => {
    scope.setUser(user)
    Sentry.captureMessage('Hello, world!')
  })
  res.send('Hello, world!')
})
