import mongoose, { type Connection } from 'mongoose'
import Logger from '../@loggers/logger.pino'
import { Env } from '../config'
import PromiseBlueBird from '../utils/bluebird'

interface MyConnection extends mongoose.Connection {
  name: string
}

function newConnection(uri: string, options: object): Connection {
  const mongodb = mongoose.createConnection(uri, options)

  mongodb.on('connected', function (this: MyConnection) {
    Logger.info(`[MongoDb:::] connected ${this.name}.db!!`)
  })
  mongodb.on('disconnected', function (this: MyConnection) {
    Logger.warn(`[MongoDb:::] disconnected ${this.name}.db!!`)
  })
  mongodb.on('error', function (this: MyConnection, err) {
    Logger.error(
      `[MongoDb:::] Failed to connect ${this.name}.db!! ${err.message}`
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on('SIGINT', async () => {
    await mongodb.close()
    process.exit(0)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on('SIGTERM', async () => {
    await mongodb.close()
    process.exit(0)
  })

  return mongodb
}

const { URI, OPTIONS } = Env.MONGO_CONNECTION

// export const platformDb = newConnection(URI, {
//   ...OPTIONS,
//   dbName: 'platform'
// })

export const [platformDb] = await PromiseBlueBird.all([
  newConnection(URI, {
    ...OPTIONS,
    dbName: 'platform'
  })
])
