import * as dotenv from 'dotenv'

const NODE_ENV =
  process.env.NODE_ENV === 'production' ? 'production.env' : 'dev.env'
dotenv.config({ path: NODE_ENV })

export const Env = {
  PORT: process.env.PORT,
  SERVICE_NAME: process.env.SERVICE_NAME,
  NODE_ENV,
  MONGO_CONNECTION: {
    URI: process.env.MONGO_URI ?? '',
    OPTIONS: {
      // useCreateIndex: true,
      // poolSize: 100,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      dbName: 'platform'
    }
  },
  REDIS_CONNECTION: {
    URI: process.env.REDIS_URI,
    HOST: process.env.REDIS_HOST ?? 'localhost',
    PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    PASSWORD: process.env.REDIS_PASSWORD,
    USERNAME: process.env.REDIS_USERNAME,
    OPTIONS: {}
  },
  SESSTION_SECRET: process.env.SESSTION_SECRET ?? 'hellocacbantre'
}
