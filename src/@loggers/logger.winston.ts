// import path from 'path'
// import winston from 'winston'

// class Logger {
//   static DEFAULT_SCOPE = 'app'
//   #scope: string

//   constructor(scope?: string) {
//     this.#scope = Logger.parsePathToScope(scope ?? Logger.DEFAULT_SCOPE)
//   }

//   private static parsePathToScope(filepath: string): string {
//     if (filepath.includes(path.sep)) {
//       filepath = filepath.replace(process.cwd(), '')
//       filepath = filepath.replace(`${path.sep}src${path.sep}`, '')
//       filepath = filepath.replace(`${path.sep}dist${path.sep}`, '')
//       filepath = filepath.replace('.ts', '')
//       filepath = filepath.replace('.js', '')
//       filepath = filepath.replace(path.sep, ':')
//     }
//     return filepath
//   }

//   private _formatScope(): string {
//     return `[${this.#scope}]`
//   }

//   private _log(level: string, message: string, args: any[]): void {
//     if (winston) {
//       winston[level](`${this._formatScope()} ${message}`, args)
//     }
//   }

//   public debug(message: string, ...args: any[]): void {
//     this._log('debug', message, args)
//   }

//   public info(message: string, ...args: any[]): void {
//     this._log('info', message, args)
//   }

//   public warn(message: string, ...args: any[]): void {
//     this._log('warn', message, args)
//   }

//   public error(message: string, ...args: any[]): void {
//     this._log('error', message, args)
//   }
// }

// export default Logger

import dayjs from 'dayjs'
import winston from 'winston'
import { Env } from '../config'

const enumerateErrorFormat = winston.format((info: any) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const Logger = winston.createLogger({
  level: Env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    enumerateErrorFormat(),
    Env.NODE_ENV === 'production' ? winston.format.uncolorize() : winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `[${dayjs().format()}] ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    })
  ]
})

export default Logger
