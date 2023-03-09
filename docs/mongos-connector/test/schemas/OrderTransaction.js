const {Schema} = require('mongoose')

module.exports = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true,
    },

    transaction_id: {
        type: String,
        index: true
    },

    type: {
        type: String,
        trim: true,
        index: true,
    },

    gateway: {
        type: String,
        trim: true,
    },

    status: {
        type: String,
        trim: true,
        default: 'success'
    },

    message: {
        type: String,
        trim: true,
    },

    amount: {
        type: Number,
        default: 0
    },

    currency: {
        type: String,
        trim: true,
        default: 'USD'
    },

    payment_details: {
        type: Schema.Types.Mixed,
        default: {},
    },

    error_code: {
        type: String,
        default: ''
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        required: true,
        index: true,
        default: Date.now,
    },
})

