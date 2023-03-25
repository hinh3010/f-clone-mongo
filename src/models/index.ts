/* eslint-disable @typescript-eslint/no-var-requires */
import { type Connection, type Model, type Document } from 'mongoose'
import path from 'path'

/**
 * Interface for the StoreDB object
 */
interface IStoreDB {
  /**
   * Get a model from the database by name
   * @param modelName - The name of the model to retrieve
   * @returns The retrieved Mongoose model object
   */
  getModel: (modelName: string) => Model<Document>

  /**
   * Get the connection object for the database
   * @returns The Mongoose connection object
   */
  getConnection: () => Connection
}

/**
 * Helper function to get the Mongoose connection object
 * @param connection - The Mongoose connection object
 * @returns A function that returns the Mongoose connection object
 */
const _getConnection = (connection: Connection) => () => {
  return connection
}

/**
 * Helper function to validate and assign options
 * @param options - The options object to validate and assign
 * @returns The validated options object
 */
const _validatedOptions = (options = {}) => {
  return Object.assign({ plugin: null }, options)
}

/**
 * Helper function to get a Mongoose model by name
 * @param connection - The Mongoose connection object
 * @param schemasDir - The directory where the Mongoose schema files are located
 * @param collection - The name of the collection for the model
 * @param options - Options to pass to the Mongoose schema constructor
 * @returns The retrieved Mongoose model object
 */
const _getModel = (connection: Connection, schemasDir: string) => {
  return (collection: string = '', options: any = {}) => {
    const opts = _validatedOptions(options)

    const file = path.join(schemasDir, collection)
    const Schema = require(file).default

    if (opts.plugin && typeof opts.plugin === 'function') {
      Schema.plugin(opts.plugin)
    }

    if (connection.models[collection]) {
      return connection.models[collection]
    }

    return connection.model<any>(collection, Schema)
  }
}

/**
 * Function to create a new StoreDB object
 * @param connection - The Mongoose connection object
 * @param schemasDir - The directory where the Mongoose schema files are located
 * @returns A new StoreDB object
 */
const createConnect = (
  connection: Connection,
  schemasDir: string
): IStoreDB => {
  return {
    getModel: _getModel(connection, schemasDir),
    getConnection: _getConnection(connection)
  }
}

export default createConnect
