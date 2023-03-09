import {BaseError} from '@pf126/common-v2'

export class MongoPoolError extends BaseError {
    constructor(message?: string) {
        super(
            `${message || 'No message.'}`,
        )
    }
}

export class InvalidDependency extends BaseError {
    constructor(message?: string) {
        super(
            `InvalidDependency: ${message || 'No message.'}`,
        )
    }
}
