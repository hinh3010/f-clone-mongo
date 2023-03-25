import * as Sentry from '@sentry/tracing'
import { Integrations } from '@sentry/tracing'

// Declare Sentry as any
const anySentry: any = Sentry

// Initialize Sentry and Tracing
anySentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  integrations: [new Integrations.Mongo()],
  tracesSampleRate: 1.0
})

// Trace a custom transaction
async function traceTransaction<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const transaction = anySentry.startTransaction({ name })
  try {
    const result = await fn()
    transaction.finish()
    return result
  } catch (error) {
    anySentry.captureException(error)
    transaction.finish()
    throw error
  }
}

// Example function that throws an error
function throwError(): void {
  throw new Error('This is an error')
}

// Catch errors using try-catch block
try {
  throwError()
} catch (error) {
  anySentry.captureException(error)
}

// Trace a custom transaction
void traceTransaction('test', async () => {
  // Your code here
})
