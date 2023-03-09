import {logger} from './logger'

type CollectFunc<T> = (target: T) => any

export class Collector {
    private timers: Map<any, NodeJS.Timeout> = new Map()

    constructor() {
    }

    public collect<T>(target: T, collectFunc: CollectFunc<T>, delay: number): NodeJS.Timeout | undefined {
        let timer = this.timers.get(target)
        if (timer) {
            clearTimeout(timer)
            timer = undefined
            this.timers.delete(target)
        }

        if (delay > 0) {
            timer = setTimeout(() => {
                logger(`Collector has been called.`)
                collectFunc(target)
            }, delay)
            this.timers.set(target, timer)
        } else {
            collectFunc(target)
        }

        return timer
    }

    public unCollect<T>(target: T): boolean {
        return this.timers.delete(target)
    }
}