const {Schema} = require('mongoose')

module.exports = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
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

    retries: {
        type: Number,
        default: 0
    },

    pushed_at: {
        type: Date
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
