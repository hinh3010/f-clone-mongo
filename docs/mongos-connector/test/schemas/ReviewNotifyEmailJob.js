const {Schema} = require('mongoose')

const ReviewNotifyEmailJob = new Schema({
    fulfillment: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Fulfillment'
    },

    order: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Order'
    },

    products: {
        type: Array,
        default: []
    },

    order_code: {
        type: String
    },

    token: {
        type: String
    },

    email: {
        type: String,
        required: true
    },

    name: {
        type: String
    },

    created: {
        type: Date,
        required: true,
        default: Date.now
    },

    updated: {
        type: Date
    },

    is_sent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    }
})

module.exports = ReviewNotifyEmailJob