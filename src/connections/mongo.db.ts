import { type IContext } from '@hellocacbantre/context'
import { createConnect, newConnection, type IStoreDB } from '@hellocacbantre/db-schemas'
import { type ConnectOptions } from 'mongoose'

export const connectDb = (uri: string, options: ConnectOptions) => newConnection(uri, options)

export const getStoreDb = (context: IContext): IStoreDB => {
  const { mongoDb } = context
  return createConnect(mongoDb.instance)
}
