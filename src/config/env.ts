import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.NODE_ENV === 'production' ? 'production.env' : '.env' })

export const Env = {
  port: process.env.PORT
}
