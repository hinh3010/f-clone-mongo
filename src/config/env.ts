import * as dotenv from 'dotenv'

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production.env' : 'dev.env'
dotenv.config({ path: NODE_ENV })

export const Env = {
  PORT: process.env.PORT,
  SERVICE_NAME: process.env.SERVICE_NAME,
  NODE_ENV,
  MONGO_CONNECTION: {
    URI: process.env.MONGO_URI ?? '',
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000
    }
  },
  REDIS_CONNECTION: {
    URI: process.env.REDIS_URI ?? '',
    HOST: process.env.REDIS_HOST ?? 'localhost',
    PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    PASSWORD: process.env.REDIS_PASSWORD,
    USERNAME: process.env.REDIS_USERNAME,
    OPTIONS: {}
  },
  SESSTION_SECRET: process.env.SESSTION_SECRET ?? 'hellocacbantre',
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? 'HelloCacBanTre',
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES ?? 50000,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? 'BatNgoChuaBaGia',
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES ?? 500000
  }
}
