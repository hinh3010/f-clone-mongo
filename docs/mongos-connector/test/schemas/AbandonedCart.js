const {Schema} = require('mongoose')

const AbandonedCart = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true,
    },

    is_sent: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'queued', 'processing', 'processed']
    },

    total_sent: {
        type: Number,
        default: 0,
    },

    total_queued: {
        type: Number,
        default: 0
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now,
        index: true,
    },
})

AbandonedCart.index({updated: 1, status: 1})
AbandonedCart.index({created: 1, status: 1})
AbandonedCart.index({status: 1, is_sent: 1, created: 1})

module.exports = AbandonedCart
