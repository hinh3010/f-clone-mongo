const {Schema} = require('mongoose')

module.exports = new Schema({
    discount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount',
        required: true,
        index: true,
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        index: true,
        required: true,
    },

    order_item: {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
    },

    amount: {
        type: Number,
        required: true,
    },

    discount_amount: {
        type: Number,
        required: true,
    },

    code: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ['percentage', 'fixed', 'offer_percentage'],
        required: true,
    },

    rule: {
        type: Schema.Types.Mixed,
    },

    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },

    created: {
        type: Date,
        default: Date.now
    },

    updated: {
        type: Date,
        default: Date.now
    },
})
