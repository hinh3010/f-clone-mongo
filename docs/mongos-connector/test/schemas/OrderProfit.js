const {Schema} = require('mongoose')

module.exports = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'cancelled', 'rejected', 'approved'],
        default: 'pending'
    },

    cancelled_at: {
        type: Date,
    },

    rejected_at: {
        type: Date,
    },

    approved_at: {
        type: Date,
    },

    order_paid_at: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    }
})
