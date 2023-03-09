import {BaseError} from '@pf126/common-v2'

export class MongoProviderNotfound extends BaseError {
    constructor(message?: string) {
        super(
            `MongoProviderNotfound: ${message || 'No message.'}`,
        )
    }
}

export class MongoProviderError extends BaseError {}
