import * as dotenv from 'dotenv'
// npm install -g ts-node
// ts-node-esm my_server.ts
const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production.env' : 'dev.env'
dotenv.config({ path: NODE_ENV })
