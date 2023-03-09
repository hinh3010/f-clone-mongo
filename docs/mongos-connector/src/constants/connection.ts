/**
 *
 connecting: Emitted when Mongoose starts making its initial connection to the MongoDB server
 connected: Emitted when Mongoose successfully makes its initial connection to the MongoDB server, or when Mongoose reconnects after losing connectivity.
 open: Equivalent to connected
 disconnecting: Your app called Connection#close() to disconnect from MongoDB
 disconnected: Emitted when Mongoose lost connection to the MongoDB server. This event may be due to your code explicitly closing the connection, the database server crashing, or network connectivity issues.
 close: Emitted after Connection#close() successfully closes the connection. If you call conn.close(), you'll get both a 'disconnected' event and a 'close' event.
 reconnected: Emitted if Mongoose lost connectivity to MongoDB and successfully reconnected. Mongoose attempts to automatically reconnect when it loses connection to the database.
 error: Emitted if an error occurs on a connection, like a parseError due to malformed data or a payload larger than 16MB.
 fullsetup: Emitted when you're connecting to a replica set and Mongoose has successfully connected to the primary and at least one secondary.
 all: Emitted when you're connecting to a replica set and Mongoose has successfully connected to all servers specified in your connection string.
 reconnectFailed: Emitted when you're connected to a standalone server and Mongoose has run out of reconnectTries. The MongoDB driver will no longer attempt to reconnect after this event is emitted. This event will never be emitted if you're connected to a replica set.
 *
 */
export enum CONNECTION_EVENT {
    CONNECTED = 'connected',
    CONNECTING = 'connecting',
    RECONNECTED = 'reconnected',
    CLOSE = 'close',
    ERROR = 'error',
    DISCONNECTING = 'disconnecting',
    DISCONNECTED = 'disconnected',
    UPDATE = 'update',
    FULLSETUP = 'fullsetup',
}

export const DEFAULT_ARGS = {
    maxReconnectAttempts: 5,
    reconnectTimeWait: 2000,
    reconnect: true,
    pingInterval: 10000,
    json: true,
}

export const TIMEOUT = 10000 // in miliseconds
export const CONNECT_TIMEOUT = 3 * 60000