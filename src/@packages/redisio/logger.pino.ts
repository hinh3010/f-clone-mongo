import pino from 'pino'
import dayjs from 'dayjs'

const Logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
  prettyPrint: true,
  base: {
    pid: false
  },
  timestamp: () => `,'time':'${dayjs().format()}"`
})

export default Logger
