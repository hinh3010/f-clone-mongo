const {Schema} = require('mongoose')

module.exports = new Schema({
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
        index: true
    },

    title: {
        type: String,
        required: true
    },

    subtitle: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    start: {
        type: Date,
        required: true
    },

    finish: {
        type: Date,
        required: true
    },

    duration_amount: {
        type: Number,
        required: true
    },

    duration_unit: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'refunded'],
        default: 'pending',
        index: true
    },

    currency: {
        type: String,
        default: 'USD'
    },

    created: {
        type: Date,
        default: Date.now
    },

    paid_at: {
        type: Date,
        index: true
    },

    paid_by_method: {
        type: String,
        enum: ['balance', 'paypal'],
        index: true
    },

    paid_meta_data: {
        type: Schema.Types.Mixed,
        default: {}
    }
})
