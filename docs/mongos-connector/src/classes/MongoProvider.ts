import {Provider, AppModule, EventPayload, EVENT_NAME} from '@pf126/core-v2'
import {ConnectionPool, DbSource, MongoDbResource} from '../pool/ConnectionPool'
import {DEFAULT_TIMEOUT} from '../constants'
import * as MongoProviderI from '../interfaces/MongoProviderInterface'
import logger from '../helpers/logger'
import {MongoProviderError} from '../exceptions/MongoProvider'
import {getSettingContainer, SettingContainer} from '@pf126/setting-container-v2'
import {buildURI} from '../helpers/mongodb'
import * as Bluebird from 'bluebird'

export type TenantName = string

export type TenantDbMap = Record<TenantName, DbSource>

export class MongoProvider extends Provider {
    public pool: ConnectionPool
    public timeout: number = DEFAULT_TIMEOUT
    private settingContainer?: SettingContainer
    public syncWithSettingRetries = 0
    public maxWithSettingRetries = 25 // max delay for sync with setting is 25*5 (readiness check period: 5s) = 125s (2min 5s), wait until auto pull group settings 1 time per minute

    constructor(pool: ConnectionPool, options?: MongoProviderI.Options) {
        super()

        this.pool = pool
        if (options && options.timeout) {
            this.timeout = options.timeout
        }

        this._setupHandleEvents()
    }

    private _setupHandleEvents() {
        this.pool.on((event: string, storeId: string, args?: any) => {
            this.emit(event, {
                storeId,
                args,
            })
        })
    }

    private _getBaseURL(): string {
        const settingContainer = this._getSettingContainer()

        const globalSettings = settingContainer.getGlobalSettings()
        const {
            mongodb_username,
            mongodb_password,
            mongodb_admin_user,
            mongodb_admin_pass,
            mongodb_replica_set,
            mongodb_auth_source
        } = globalSettings

        const clusterSettings = settingContainer.getClusterSettings()
        const {mongodb_uri} = clusterSettings

        let dbUsername = mongodb_admin_user
        let dbPassword = mongodb_admin_pass
        if (!dbUsername || !dbPassword) {
            dbUsername = mongodb_username
            dbPassword = mongodb_password
        }

        return buildURI({
            hostPort: mongodb_uri,
            username: dbUsername,
            password: dbPassword
        }, {replicaSet: mongodb_replica_set, authSource: mongodb_auth_source})
    }

    private _getMongoDbResources(): MongoDbResource[] {
        const settingContainer = this._getSettingContainer()

        const mongoDbSource = settingContainer.getResource('mongodb')

        if (!mongoDbSource) {
            throw new MongoProviderError(`Cannot get mongodb resource from setting`)
        }

        return Object.values(mongoDbSource)
    }

    private _getTenantDbMap(): TenantDbMap {
        const settingContainer = this._getSettingContainer()

        const groupSettings = settingContainer.getGroupSettings()

        const dbMap: TenantDbMap = {}

        Object.keys(groupSettings).forEach(key => {
            const storeSetting = groupSettings[key]
            const {slug, db_name, resources} = storeSetting

            if (!resources || !resources.mongodb) {
                throw new MongoProviderError(`Incompatible mongos version store(${key}) (missing mongodb resource)`)
            }

            dbMap[slug] = {
                dbName: db_name,
                resource: resources.mongodb
            }
        })

        return dbMap
    }

    private _getSettingContainer(): SettingContainer {
        if (!this.settingContainer) {
            throw new MongoProviderError(`Missing setting container`)
        }

        return this.settingContainer
    }

    private async _loadTenantDb(tenantDbMap: TenantDbMap, panicError?: boolean) {
        logger(`Loading DB: ${Object.keys(tenantDbMap).join(', ')}`)

        let error = null

        await Bluebird.each(Object.keys(tenantDbMap), async (tenantName: string) => {
            const dbSource = tenantDbMap[tenantName]
            if (!dbSource) {
                logger(`Loading fail ${tenantName}, missing/invalid db_source.`)

                return
            }

            error = await this.pool.add(tenantName, dbSource)

            if (error && panicError) {
                throw error
            }
        })

        if (error) {
            console.warn('[WARNING] mongos-connector: load tenant db err', error)
        }

        return error
    }

    public async bootstrap(app: AppModule): Promise<void> {
        // store app module
        this.app = app

        // create setting-container instance
        this.settingContainer = getSettingContainer(app)

        // get all tenant db name from setting-container
        const tenantDbMap = this._getTenantDbMap()

        // get mongodb resource for create base connection
        const mongodbResources = this._getMongoDbResources()

        // connect/create base connection
        await this.pool.connect(mongodbResources)

        // load all tenant db from tenant db map, panic/throw error if any
        await this._loadTenantDb(tenantDbMap, true)

        logger(`bootstrap has been called.`)
    }

    public async reload(payload: EventPayload) {
        if (payload.name === EVENT_NAME.LIST_STORE_CHANGED) {
            logger(`EVENT_NAME.LIST_STORE_CHANGED`, payload.args)
            await this._handleChangeListStore(payload)
        }

        if (payload.name === EVENT_NAME.RELOAD_SINGLE_STORE_SETTINGS) {
            logger(`EVENT_NAME.RELOAD_SINGLE_STORE_SETTINGS`, payload.args)
            await this._handleSingleStoreReload(payload)
        }

        logger(`reload has been called.`)
    }

    public async renew(): Promise<void> {
        // flush all old tenant db except base connection
        this.pool.flush()

        // get all tenant db name from setting-container
        const tenantDbMap = this._getTenantDbMap()

        // load all tenant db from tenant db map, won't panic/throw error, only warning
        await this._loadTenantDb(tenantDbMap, false)

        logger(`renew has been called.`)
    }

    public getConnection(): ConnectionPool {
        return this.pool
    }

    // (PLC-1075): Bug old reload mechanism of setting-container-v2(<v3.x.x)
    // Comparing current list store connection loaded with list store in setting container to detect missing connection
    public async _isSyncWithSetting() {
        if (!this.settingContainer) {
            this.captureMessage(`[MongoDB] Problem with connections due to SettingContainer is undefined`)
            logger(`[SYNC_WITH_SETTING] SettingContainer is undefined`)
            console.error(`[MONGOS_CONNECTOR][ERROR] SettingContainer is undefined`)
            return false
        }

        const storeIdsInSetting = this.settingContainer.getStoreIds()
        const storeIdsInPool = Array.from(this.pool.connections.keys())

        const storesNeedToRemove = storeIdsInPool.filter(storeId => {
            return !storeIdsInSetting.includes(storeId)
        })

        const storesNeedToAdd = storeIdsInSetting.filter(storeId => {
            return !storeIdsInPool.includes(storeId)
        })

        try {
            if (storesNeedToAdd.length || storesNeedToRemove.length) {
                console.log(`[MONGOS_CONNECTOR]: Removing connection to stores:`, storesNeedToRemove)
                console.log(`[MONGOS_CONNECTOR]: Add connection to stores:`, storesNeedToAdd)
                await this.reload({
                    name: EVENT_NAME.LIST_STORE_CHANGED,
                    args: {
                        add: storesNeedToAdd,
                        remove: storesNeedToRemove
                    }
                })
            }
        } catch (error: any) {
            this.captureMessage(`[MongoDB] Problem occur when hot reload | remove: ${storesNeedToRemove} | add: ${storesNeedToAdd}`, {
                error: error.message
            })
            console.error(`[MONGOS_CONNECTOR][ERROR] Cannot add connection to ${storesNeedToAdd} | remove connection of ${storesNeedToRemove} | Reason`, error)
            return false
        }

        return true
    }

    public async isConnected(): Promise<boolean> {
        const isSynchronized = await this._isSyncWithSetting()

        if (!isSynchronized) {
            this.syncWithSettingRetries += 1
            console.error(`[MONGOS_CONNECTOR][ERROR] Not sync with setting, please check the log above | retries=${this.syncWithSettingRetries}, maxRetries=${this.maxWithSettingRetries}`)

            return this.syncWithSettingRetries >= this.maxWithSettingRetries
        }
        this.syncWithSettingRetries = 0
        
        return this.pool.isConnected()
    }

    private async _handleChangeListStore(payload: EventPayload) {
        // validate payload args
        const {args} = payload
        if (!Array.isArray(args.add) || !Array.isArray(args.remove)) {
            throw new MongoProviderError(`Invalid payload of event 'LIST_STORE_CHANGED'`)
        }

        // get all current tenant db from setting
        const tenantDbMap = this._getTenantDbMap()

        // convert args.add array (contain store_id) to tenantDbMap, result in tenantDbMap Added
        const tenantDbMapAdded = args.add.reduce((prev: TenantDbMap, storeSlug: string) => {
            const dbName = tenantDbMap[storeSlug]

            if (!dbName) {
                logger(`Loading '${storeSlug}' failed, missing DB_NAME`)

                return
            }

            prev[storeSlug] = dbName

            return prev
        }, {})

        // load added tenant db (when has new activated store)
        await this._loadTenantDb(tenantDbMapAdded, false)

        // remove all tenant db was no longer in setting-container (when store is suspend)
        args.remove.forEach((storeSlug: string) => {
            this.pool.remove(storeSlug)
        })
    }

    private async _handleSingleStoreReload(payload: EventPayload): Promise<void> {
        // validate payload args
        const {storeId} = Object.assign({storeId: ''}, payload.args)
        if (!storeId) return
        // get all current tenant db from setting
        const tenantDbMap = this._getTenantDbMap()

        // get db name of reloaded tenant
        const dbSource = tenantDbMap[storeId] || null
        if (!dbSource) {
            throw new MongoProviderError(`DB_SOURCE of store ID: ${storeId} not found`)
        }
        logger('DB_NAME:', dbSource.dbName)

        // create/or update new connection for new tenant db
        await this.pool.add(storeId, dbSource)
        // logger(`Updated mongodb connection for ${storeId} with db_name: ${dbSource.dbName}, src: ${dbSource.resource.specs.base_auth_source}`)
    }

}
