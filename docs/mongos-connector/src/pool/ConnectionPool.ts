import ConnectionOptions from '../types/ConnectionOptions'
import { cloneConnection, Connection, createConnection } from '../single/createConnection'
import { createStore } from '../single/createStore'
import { StoreDB } from '../interfaces/StoreDB'
import { AppModule } from '@pf126/core-v2'
import { MongoPoolError } from '../exceptions/ConnectionPool'
import logger from '../helpers/logger'
import { STATES } from 'mongoose'
import { buildURI } from '../helpers/mongodb'
import Bluebird = require('bluebird')
import { Collector } from '../helpers/Collector'
import { SimpleSentry } from '@pf126/sentry/dist/classes/SimpleSentry'
import delay from '../helpers/delay'

const _createConnectionWithNamespace = async (
    namespace: string,
    uri: string,
    opts: ConnectionOptions,
    eventListener: Function
): Promise<[Error | null, Connection | null]> => {
    try {
        const result = await createConnection(
            uri,
            Object.assign({}, opts, { namespace }), eventListener
        )

        return result
    } catch (e: any) {

        return [e, null]
    }
}

const _cloneConnectionWithNamespace = async (
    baseConnection: Connection,
    namespace: string,
    eventListener?: Function
): Promise<[Error | null, Connection | null]> => {
    try {
        const connection = await cloneConnection(baseConnection, namespace, eventListener)

        return [null, connection]
    } catch (e: any) {

        return [e, null]
    }
}

export interface MongoDbResource {
    _id: string,
    name: string,
    specs: {
        uri: string,
        replicaset?: string,
        base_username: string,
        base_password: string,
        base_auth_source?: string,
    }
}

export interface DbSource {
    dbName: string
    resource: MongoDbResource
}

type MONGODB_URI = string

const BASE_NS_CONN = '$_base'

interface MapPool {
    [key: string]: MONGODB_URI,
}

class BaseConnection {
    private readonly source: MongoDbResource
    private readonly connection: Connection
    connections: Map<string, NSConnection> = new Map()

    constructor(source: MongoDbResource, connection: Connection) {
        this.source = source
        this.connection = connection
    }

    public getSource(): MongoDbResource {
        return this.source
    }

    public async newNSConnection(namespace: string, dbName: string): Promise<NSConnection> {
        const [error, connection] = await _cloneConnectionWithNamespace(this.connection, dbName)

        if (!connection) {
            throw new Error(`_cloneConnectionWithNamespace return null`)
        }

        if (error) {
            throw error
        }

        const nsConn = new NSConnection(namespace, connection, this)
        this.connections.set(namespace, nsConn)

        return nsConn
    }

    public removeNSConnection(namespace: string) {
        const nsConn = this.connections.get(namespace)
        if (nsConn) {
            nsConn.close()
            this.connections.delete(namespace)
            console.log(namespace, 'removed')
        }
        // @TODO: close base connection when empty
        if (!this.connections.size) {
            // close
        }
    }

    public close() {
        for (const [ns] of this.connections) {
            this.removeNSConnection(ns)
        }

        return this.connection.close((err) => {
            if (err) {
                logger(`Close base connection(${this.source._id}) fail, ERR: `, err)
            } else {
                logger(`Close base connection(${this.source._id}) success`)
            }
        })
    }

    public getNativeConnection(): Connection {
        return this.connection
    }
}

class NSConnection {
    private readonly namespace: string
    private readonly baseRef: BaseConnection | null
    private readonly connection: Connection

    constructor(ns: string, connection: Connection, baseRef: BaseConnection | null) {
        this.namespace = ns
        this.connection = connection
        this.baseRef = baseRef
    }

    public getBaseConnection(): BaseConnection | null {
        return this.baseRef
    }

    public getConnection() {
        return this.connection
    }

    public close() {
        console.log(this.namespace, 'closed')
        // @ts-ignore
        this.connection.deleteModel(/.*/)
        this.connection.removeAllListeners()
    }

    public destroy() {
        if (this.baseRef) {
            this.baseRef.removeNSConnection(this.namespace)
        } else {
            this.close()
        }
    }
}

export class ConnectionPool {
    connections: Map<string, NSConnection> = new Map()
    stores = new Map()
    schemasDir: string = ''
    opts: ConnectionOptions = {}
    app?: AppModule
    sentry?: SimpleSentry
    private $_baseConn: Map<string, BaseConnection> = new Map()
    private collector: Collector = new Collector()

    private _eventListeners: Array<Function> = []

    constructor(maps: MapPool, opts: ConnectionOptions, schemasDir: string) {
        if (opts.poolSize) {
            opts.poolSize = parseInt(opts.poolSize as any)
        }
        this.opts = opts
        this.schemasDir = schemasDir

        const namespaces = Object.keys(maps)

        namespaces.forEach((namespace) => {
            const uri = maps[namespace]
            setImmediate(async () => {
                const [error, connection] = await _createConnectionWithNamespace(
                    namespace, uri, opts, this._handleEvents(namespace)
                )

                if (!connection) {
                    throw new Error(`_createConnectionWithNamespace return null`)
                }

                this.connections.set(namespace, new NSConnection(namespace, connection, null))

                if (error) {
                    throw error
                }
            })
        })

    }

    private async _createBaseConn(resource: MongoDbResource): Promise<BaseConnection> {
        const { _id, specs } = resource
        const exists = this._getBaseConnectionById(_id)
        if (exists) {
            logger(`[WARN] duplicate call _createBaseConn on the same _id -> skip`)

            return exists
        }

        const baseURI = buildURI({
            hostPort: specs.uri,
            username: specs.base_username,
            password: specs.base_password
        }, {
            replicaSet: specs.replicaset,
            authSource: specs.base_auth_source
        }, this.opts.defaultWriteConcern)

        const [error, connection] = await _createConnectionWithNamespace(
            `${BASE_NS_CONN}_${_id}`,
            baseURI,
            this.opts,
            this._handleEvents(BASE_NS_CONN)
        )

        if (error) {
            throw error
        }

        if (!connection) {
            throw new MongoPoolError(
                `create base connection return null`
            )
        }

        const baseConn = new BaseConnection(resource, connection)
        this.$_baseConn.set(_id, baseConn)

        logger(`Connect ${baseURI}(${_id})`)

        return baseConn
    }

    private _closeBaseConnById(_id: string): boolean {
        const connection = this._getBaseConnectionById(_id)

        if (!connection) {
            return false
        }

        // clean up map table in current pool
        for (const [ns] of connection.connections) {
            this.connections.delete(ns)
        }

        connection.close()

        return true
    }

    private _closeBaseConn(baseConn: BaseConnection): boolean {
        const connection = this._getBaseConnectionById(baseConn.getSource()._id)
        if (connection === baseConn) {
            // clean up map table in current pool
            for (const [ns] of baseConn.connections) {
                this.connections.delete(ns)
            }

            this.$_baseConn.delete(baseConn.getSource()._id)
        }

        baseConn.close()

        return true
    }

    private _getBaseConnectionById(_id: string): BaseConnection | null {
        return this.$_baseConn.get(_id) || null
    }

    private async _getBaseConnection(resource: MongoDbResource, upsert?: boolean): Promise<BaseConnection> {
        let baseConn = this._getBaseConnectionById(resource._id)

        if (!baseConn) {
            if (!upsert) {
                throw new MongoPoolError(`BaseConnection(${resource._id}) wasn't initialized.`)
            }

            baseConn = await this._createBaseConn(resource)
        }

        return baseConn
    }

    public on(eventListener: Function) {
        if (typeof eventListener !== 'function') return

        this._eventListeners.push(eventListener)
    }

    private _handleEvents = (storeId: string) => (event: string, args: any) => {
        if (!this._eventListeners.length) return

        this._eventListeners.forEach((eventListener: Function) => {
            eventListener(event, storeId, args)
        })
    }

    private _isConnFromSameSource(connection: NSConnection, dbSource: DbSource): boolean {
        const baseConn = connection.getBaseConnection()
        if (!baseConn) {
            return false
        }

        // @FIXME: comparing resource object reference instead of _id string, but notice that comparing resource object may need
        // @FIXME: to update base connection with the same _id due to resource.specs changed
        return baseConn.getSource()._id === dbSource.resource._id
    }

    public async add(namespace: string, dbSource: DbSource): Promise<Error | null> {
        const oldConnection = this.connections.get(namespace)
        if (oldConnection) {
            if (this._isConnFromSameSource(oldConnection, dbSource)) {
                return null
            } else {
                this.remove(namespace)
            }
        }

        const { resource, dbName } = dbSource

        const baseConn = await this._getBaseConnection(resource, true)

        const [error, connection] = await baseConn.newNSConnection(namespace, dbName)
            .then(connection => [null, connection])
            .catch(error => [error, null])

        if (error) {
            logger(`Add ${namespace} connection fail, reason: ${error.message}`)
            return error
        }

        logger(`${namespace} added ${dbSource.dbName}, src: ${dbSource.resource.specs.uri}`)

        this.connections.set(namespace, connection)

        return null
    }

    private pruneBaseConnection(baseConn: BaseConnection | null) {
        if (baseConn) {
            this.collector.collect<BaseConnection>(baseConn, (_baseConn) => {
                if (_baseConn.connections.size === 0) {
                    const _baseConnResource = _baseConn.getSource()
                    logger(`[COLLECTOR]: Close _baseConn with resource(id=${_baseConnResource._id}, name=${_baseConnResource.name})`)
                    console.error(`[MONGOS_CONNECTOR][ERROR]: Close _baseConn with resource(id=${_baseConnResource._id}, name=${_baseConnResource.name})`)
                    _baseConn.close()
                    this._closeBaseConn(_baseConn)
                }
            }, 5 * 60000) // after 5 mins, the collector will be run
        }
    }

    public remove(namespace: string): ConnectionPool {
        const connection = this.connections.get(namespace)

        if (!connection) {
            logger(`Missing connection of ${namespace}, skip remove this`)

            return this
        }

        connection.destroy()

        this.connections.delete(namespace)

        const baseConn = connection.getBaseConnection()
        this.pruneBaseConnection(baseConn)

        logger(`the connection of ${namespace} was removed`)

        return this
    }

    public getConnection(namespace: string): Connection | null | undefined {
        const connection = this.connections.get(namespace)

        if (!connection) {
            return null
        }

        return connection.getConnection()
    }

    public getStore(namespace: string): StoreDB {
        const connection = this.getConnection(namespace)

        if (!connection) {
            throw new MongoPoolError(
                `MongoConnection of ${namespace} not found or has been suspended`
            )
        }

        return createStore(connection, this.schemasDir)
    }

    public async connect(sources: MongoDbResource[]) {
        if (!Array.isArray(sources)) {
            throw new MongoPoolError(`Invalid mongodb Resource`)
        }

        if (!sources.length) {
            logger(`[WARN] Empty mongodb Resource?`)
        }

        await Bluebird.map(sources, async (source) => {
            await this._createBaseConn(source)
        }, { concurrency: 1 })
    }

    private static _isBadConn(connection: Connection): boolean {
        const state = connection.readyState
        const humanState = STATES[state]

        const isBad = ![STATES.connected, STATES.connecting].includes(state)
        if (isBad) {
            logger(`[WARN] The connection with namespace=${connection.__namespace}, host=${connection.host} has the bad state - readyState=${humanState}|${connection.readyState}`)
            console.error(`[MONGOS_CONNECTOR][ERROR] The connection with namespace=${connection.__namespace}, host=${connection.host} has the bad state - readyState=${humanState}|${connection.readyState}`)
        }

        if (state === STATES.connecting) {
            console.warn(`[MONGOS_CONNECTOR][WARN] The connection with namespace=${connection.__namespace}, host=${connection.host} has the connecting state - readyState=${humanState}|${connection.readyState}`)
        }

        return isBad
    }

    public async isConnected(retry = 3, retryWait = 1000): Promise<boolean> {
        let currentRetry = 0
        const allConnections = Array.from(this.$_baseConn.values()).map(conn => conn.getNativeConnection())
        let isConnected = true

        while (currentRetry < retry) {
            const badHealths = allConnections.filter(connection => {
                logger(`Start check isConnected for the connection with namespace=${connection.__namespace}, host=${connection.host}`)
                return !connection || ConnectionPool._isBadConn(connection)
            })

            isConnected = !badHealths.length
            if (isConnected) {
                break
            }

            currentRetry = currentRetry + 1

            if (currentRetry >= retry) {
                const captureInfos = badHealths.map(connection => {
                    const { __namespace, host, readyState } = connection
                    return { namespace: __namespace, host, state: STATES[readyState] }
                })

                const hostStates = captureInfos.map(info => {
                    const { host, state } = info
                    return `host=${host}|state=${state}`
                }).join(', ')

                if (captureInfos.length) {
                    this.captureMessage(`[MongoDB] Problem with connections to ${hostStates}`, {
                        badConnections: JSON.stringify(captureInfos)
                    })
                }

                console.error(`[MONGOS_CONNECTOR][ERROR] Over max retry check isConnected for ${allConnections.length} connections, currentRetry: ${currentRetry}, retry: ${retry}, retryWait: ${retryWait}ms`)
            } else {
                console.warn(`[MONGOS_CONNECTOR][WARN] Retry check isConnected for ${allConnections.length} connections, currentRetry: ${currentRetry}, retry: ${retry}, retryWait: ${retryWait}ms`)
            }

            await delay(retryWait)
        }

        return isConnected
    }

    public captureMessage(error: string | Error, extra = {}) {
        if (!this.sentry) {
            console.warn(`[PROVIDER:MONGODB]: Sentry is not be injected yet`)
            return
        }
        Object.assign(extra, {
            provider: 'PROVIDER:MONGODB',
            time: Date.now().toString()
        })
        let message = ''
        if (error instanceof Error) {
            Object.assign(extra, { originalError: error })
            message = `[HEARTBEAT]: ${error.message}`
        } else {
            message = `[HEARTBEAT]: ${error}`
        }
        return this.sentry.capture(message, {
            extra,
            tag: 'heartbeat'
        })
    }

    public setSentry(sentry: SimpleSentry) {
        this.sentry = sentry
    }

    // flush all "cloned" connection except base connection
    public flush() {
        this.connections.forEach((connection, namespace) => {
            // this._disconnectConn(namespace)
            this.remove(namespace)
        })

        this.connections.clear()
    }
}
