export interface SchemeURI {
    username?: string,
    password?: string,
    host?: string,
    hostPort?: string,
    port?: string | number,
    dbname?: string
}

type OptionAvail = 'authSource' | 'replicaSet'

export type SchemeOptions = Record<OptionAvail | string, string | undefined>

// replica set example: mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017,mongodb1.example.com:27017,mongodb2.example.com:27017/?authSource=admin&replicaSet=myRepl
export function buildURI(scheme: SchemeURI, options?: SchemeOptions, writeConcern?: boolean) {
    let uri = `mongodb://`

    if (scheme.username && scheme.password) {
        uri += `${scheme.username}:${scheme.password}@`
    }

    if (scheme.hostPort) {
        uri += scheme.hostPort
    } else {
        if (!scheme.host) {
            throw new Error('Invalid hostname')
        }
        uri += scheme.host

        if (scheme.port) {
            uri += `:${scheme.port}`
        } else {
            uri += ':27017'
        }
    }

    uri += '/'

    if (scheme.dbname) {
        uri += `${scheme.dbname}`
    }

    if (options && writeConcern) {
        options.w = 'majority'
        options.wtimeoutMS = '8000'

    }

    const availableOptions = options ? Object.keys(options).filter((key) => options[key]) : []

    if (availableOptions.length > 0 && options) {
        uri += `?${availableOptions.map(key => `${key}=${options[key]}`).join('&')}`
    }

    return uri
}
