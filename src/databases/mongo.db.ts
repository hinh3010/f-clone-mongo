// import { Promise as BluebirdPromise } from 'bluebird'
import mongoose, { type Connection } from 'mongoose'
import Logger from '../@loggers/logger.pino'
import { Env } from '../config'

interface MyConnection extends mongoose.Connection {
  name: string
}

function newConnection(uri: string, options: object): Connection {
  const mongodb = mongoose.createConnection(uri, options)

  mongodb.on('connected', function (this: MyConnection) {
    Logger.info(`[MongoDb:::] connected ${this.name}!!`)
  })
  mongodb.on('disconnected', function (this: MyConnection) {
    Logger.warn(`[MongoDb:::] disconnected ${this.name}!!`)
  })
  mongodb.on('error', function (this: MyConnection, err) {
    Logger.error(`[MongoDb:::] Failed to connect ${this.name}!!`, err.message)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on('SIGINT', async () => {
    await mongodb.close()
    process.exit(0)
  })

  return mongodb
}

const mongooseDbConnect = async (): Promise<any> => {
  try {
    const { URI, OPTIONS } = Env.MONGO_CONNECTION
    newConnection(URI, OPTIONS)
  } catch (error) {
    Logger.error(`[MongoDB:::] Failed to connect ${error}`)
  }
}

export default mongooseDbConnect
