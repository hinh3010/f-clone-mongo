import {RequestContext} from "@pf126/core-v2"
import Mongoose = require( "mongoose")
import {getStore} from "./getModelContext"


export const enableDebugger = (requestContext: RequestContext) => async () => {
    Mongoose.set('debug', true)

    const {storeId} = requestContext.context
    const {getConnection} = getStore(requestContext)
    const connection = getConnection()
    console.log('START_DB_CONNECTION:', storeId)
    console.log(connection)
    console.log('END_DB_CONNECTION:', storeId)

    return false
}