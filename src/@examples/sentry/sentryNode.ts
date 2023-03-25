import * as Sentry from '@sentry/node'

type Severity = 'debug' | 'info' | 'warning' | 'error' | 'fatal'

// Initialize Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN'
})

// Example function that throws an error
function throwError(): void {
  throw new Error('This is an error')
}

// Catch errors using try-catch block
try {
  throwError()
} catch (error) {
  Sentry.captureException(error)
}

// Catch errors using Promise.catch()
Promise.reject(new Error('This is another error')).catch((error) => {
  Sentry.captureException(error)
})

// Capture messages
Sentry.captureMessage('This is a custom message', 'info' as Severity)
