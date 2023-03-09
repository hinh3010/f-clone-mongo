const {Schema} = require('mongoose')

module.exports = new Schema({
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
        index: true,
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        index: true
    },

    price: {
        type: Number
    },

    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'refunded', 'cancelled','hold'],
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
