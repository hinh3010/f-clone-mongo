import {Connection} from "mongoose"
import * as path from 'path'
import {StoreDB} from "../interfaces/StoreDB"

const log = require('debug')('pf126:mongodb')


const _getConnection = (connection: Connection) => () => {
    return connection
}

const _validatedOptions = (options = {}) => {
    return Object.assign({plugin: null}, options)
}

const _getModel = (connection: Connection, schemasDir: string) => (collection: string = '', options: any = {}) => {
    const opts = _validatedOptions(options)

    try {
        const file = path.join(schemasDir, collection)
        const Schema = require(file)
        if (opts.plugin && typeof opts.plugin === 'function') {
            Schema.plugin(opts.plugin)
        }

        if(connection.models[collection]) {
            return connection.models[collection]; 
        }

        return connection.model<any>(collection, Schema)
    } catch (e) {
        log('GET_MODEL_ERROR', e)

        throw e
    }
}

export const createStore = (connection: Connection, schemasDir: string): StoreDB => {
    return {
        getModel: _getModel(connection, schemasDir),
        getConnection: _getConnection(connection)
    }
}

