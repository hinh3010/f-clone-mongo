import mongoose from 'mongoose'
import Logger from '../@loggers/logger.pino'
import { Env } from '../config'

mongoose.connect(Env.MONGO_URI)
  .then(() => { Logger.info('Connected to MongoDB!') })
  .catch(error => { Logger.error('Could not connect to MongoDB...', error) })

mongoose.set('debug', true)
