const {Schema} = require('mongoose')

const OrderIntegrationJob = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
    },

    type: {
        type: String,
        trim: true,
    },

    manual: {
        type: Boolean,
        index: true,
        default: false
    },

    is_legacy: {
        type: Boolean,
        default: false,
    },

    is_failed: {
        type: Boolean,
        default: false,
    },

    error_message: {
        type: String,
    },

    is_pushed: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        default: 'pending',
        trim: true,
        index: true,
    },

    retries: {
        type: Number,
        default: 0
    },

    pushed_at: {
        type: Date
    },

    data: {
        type: Schema.Types.Mixed,
        default: {}
    },

    updated: {
        type: Date,
        index: true,
    },

    created: {
        type: Date,
        default: Date.now,
        index: true,
    },
})

OrderIntegrationJob.index({
    order: 1,
    type: 1,
})

OrderIntegrationJob.index({
    type: 1,
    is_pushed: 1,
    created: 1,
})

module.exports = OrderIntegrationJob
