import {Provider, RequestContext} from '@pf126/core-v2'
import {PROVIDER_MONGODB} from '../constants'
import {StoreDB} from '../interfaces/StoreDB'
import {MongoProviderNotfound} from '../exceptions/MongoProvider'
import {ConnectionPool} from '../pool/ConnectionPool'


export const getStore = (requestContext: RequestContext): StoreDB => {
    const {context, app} = requestContext
    const mongoProvider: Provider | undefined = app.getProvider(PROVIDER_MONGODB)

    if (!mongoProvider) throw new MongoProviderNotfound(`Cannot found Provider when getStore.`)

    const pool: ConnectionPool = mongoProvider.getConnection()
    const {storeId} = context

    return pool.getStore(storeId)
}

