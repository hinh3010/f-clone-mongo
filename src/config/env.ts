import * as dotenv from 'dotenv'

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production.env' : 'dev.env'
dotenv.config({ path: NODE_ENV })

export const Env = {
  PORT: process.env.PORT,
  PROJECT_NAME: '',
  NODE_ENV,
  MONGO_CONNECTION: {
    URI: process.env.MONGO_URI ?? '',
    OPTIONS: {
      // useCreateIndex: true,
      // poolSize: 10
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      dbName: 'platform'
    }
  }
}
