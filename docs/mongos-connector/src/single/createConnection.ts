import Mongoose = require( 'mongoose')
import {Connection as MongooseConnection} from 'mongoose'
import ConnectionOptions from '../types/ConnectionOptions'
import logger from '../helpers/logger'
import {CONNECTION_EVENT, CONNECT_TIMEOUT} from '../constants'
import withTimeout from '../helpers/withTimeout'
import {Utils} from '@pf126/common-v2'

export interface Connection extends MongooseConnection {
    __connectedBefore?: boolean
    __namespace?: string
    __options?: ConnectionOptions
    __isClone?: boolean // this property determine if this connection was cloned by connection.useDb()
}

// Mongoose.set('useCreateIndex', true)

type CreateConnectionResult = [Error | null, Connection]

function _wrapWithDeadline<T extends (...args: any[]) => Connection>(fn: T): (...args: Parameters<T>) => Promise<CreateConnectionResult> {
    return (...args: Parameters<T>) => {
        const connection = fn(...args)

        const defer = Utils.defer<CreateConnectionResult>()

        const _markFirstConnected = () => {
            if (!connection.__connectedBefore) {
                connection.__connectedBefore = true
            }
            defer.resolve([null, connection])
        }

        connection.once(CONNECTION_EVENT.CONNECTED, _markFirstConnected)

        return withTimeout<CreateConnectionResult>(defer, connection.__options?.connectTimeout || CONNECT_TIMEOUT, (deadlineErr) => {
            defer.reject(deadlineErr)

            connection.removeListener(CONNECTION_EVENT.CONNECTED, _markFirstConnected)

            /** after moving into one-pool model don't close connection at this point, it will close pool */
        }).catch((error: Error) => [error, connection])
    }
}

const _attachCommonEvent = (connection: Connection, eventListener?: Function) => {
    const logInfo = connection.__namespace ? logger.extend(connection.__namespace) : logger

    const _emitEvent = (event: string, args: any = null) => {
        if (!eventListener || typeof eventListener !== 'function') return

        eventListener(event, args)
    }

    const start = Date.now()

    connection.on(CONNECTION_EVENT.CONNECTED, () => {
        const finish = Date.now()
        logInfo('MongoDB is connected.', finish - start)
        _emitEvent(CONNECTION_EVENT.CONNECTED)
    })

    connection.on(CONNECTION_EVENT.CONNECTING, () => {
        logInfo('MongoDB is connecting.')
        _emitEvent(CONNECTION_EVENT.CONNECTING)
    })

    connection.on(CONNECTION_EVENT.DISCONNECTING, () => {
        logInfo('MongoDB is disconnecting.')
        _emitEvent(CONNECTION_EVENT.DISCONNECTING)
    })

    connection.on(CONNECTION_EVENT.DISCONNECTED, () => {
        logInfo('MongoDB is disconnected.')
        _emitEvent(CONNECTION_EVENT.DISCONNECTED)
    })

    connection.on(CONNECTION_EVENT.ERROR, (error) => {
        logInfo('MONGODB_ERROR', error)
        _emitEvent(CONNECTION_EVENT.ERROR, error)
    })
}

/**
 * Connect to database.
 */
const _createConnectionFromURI = (uri: string, options: ConnectionOptions, eventListener?: Function): Connection => {
    // console.log(options)
    if (!uri) {
        throw new Error('\'uri\' is required.')
    }

    const defaultOptions = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }

    const optionValidated = Object.assign(defaultOptions, options)
    const {namespace} = optionValidated

    if (optionValidated.hasOwnProperty('debug')) {
        Mongoose.set('debug', !!optionValidated.debug)
    } else {
        Mongoose.set('debug', process.env.NODE_ENV !== 'production')
    }

    delete optionValidated.namespace
    delete optionValidated.debug
    delete optionValidated.connectTimeout
    delete optionValidated.defaultWriteConcern

    const connection: Connection = Mongoose
        .createConnection(uri, optionValidated)

    connection.__connectedBefore = false
    connection.__namespace = namespace
    connection.__options = options

    _attachCommonEvent(connection, eventListener)

    return connection
}

const _createConnectionFromUseDb = (baseConn: Connection, dbName: string, eventListener?: Function): Connection => {
    // useCache: false ->
    //     we will manually manage the connection cache
    // noListener: true ->
    //     we don't want the warning: MaxListenersExceededWarning, so using noListener: true will let
    //     the application use less memory in a long running, but notice that
    //     we may won't aware of connection state changes. We have strong believe in mongo driver about manage the pool.
    //     So we don't manage it ourselves
    const connection: Connection = baseConn.useDb(dbName, {useCache: false, noListener: true})

    connection.__namespace = dbName
    connection.__isClone = true

    // noListener: true, so we don't need _attachCommonEvent(connection, eventListener)

    return connection
}

export const createConnection = _wrapWithDeadline(_createConnectionFromURI)

export const cloneConnection = _createConnectionFromUseDb
