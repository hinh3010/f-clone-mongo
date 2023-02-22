import mongoose from 'mongoose'
import { Env } from '../config'

mongoose.connect(Env.MONGO_URI)
  .then(() => { console.log('Connected to MongoDB!') })
  .catch(error => { console.error('Could not connect to MongoDB...', error) })

mongoose.set('debug', true)
