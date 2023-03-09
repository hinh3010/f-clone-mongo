import {Utils} from '@pf126/common-v2'

function isType<Type>(data: any): data is Type {
    return !!data
}

class DeadlineExceeded extends Error {
}

function _clearTimer(timer: NodeJS.Timeout | null) {
    if (timer) {
        clearTimeout(timer)
    }
}

type CleanOnTimeoutCallback = (error: DeadlineExceeded) => void

function withTimeout<T>(promise: Promise<T>, timeout: number, cleanOnTimeout?: CleanOnTimeoutCallback): Promise<T> {
    const defer = Utils.defer()
    const timer = setTimeout(() => {
        defer.reject(new DeadlineExceeded('Exceed deadline, timeout occur'))
    }, timeout)

    return Promise.race([promise, defer]).then((result: any) => {
        if (isType<T>(result)) {
            return result
        }
        _clearTimer(timer)

        return result
    }).catch((err) => {
        if (err instanceof DeadlineExceeded) {
            if (cleanOnTimeout) {
                cleanOnTimeout(err)
            }
        }

        _clearTimer(timer)

        throw err
    })
}

const TimeoutPromise = (callback: (resolve: Function, reject: Function) => void) => {
    const defer = Utils.defer()
    let isFulfilled = false
    let timer: NodeJS.Timeout | null = null

    const resolve = (value: any) => {
        if (isFulfilled) {
            return false
        }

        defer.resolve(value)

        return true
    }

    const reject = (error: Error) => {
        if (isFulfilled) {
            return false
        }

        defer.reject(error)

        return true
    }

    callback(resolve, reject)

    if (!isFulfilled) {
        timer = setTimeout(() => {
            reject(new Error('Timeout exceeded'))
        }, 5000)
    }

    const _cleanup = () => {
        _clearTimer(timer)
    }

    return defer.finally(() => {
        _cleanup()
    })
}

export default withTimeout
export {
    withTimeout,
    TimeoutPromise
}