const {Schema} = require('mongoose')

module.exports = new Schema({
    product_label: {
        type: String,
        trim: true,
        index: true,
        enum: ['product', 'branding']
    },

    product_type: {
        type: String,
        trim: true
    },

    fulfillment: {
        type: Schema.Types.ObjectId,
        ref: 'Fulfillment',
        required: true,
        index: true,
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        index: true,
        required: true
    },

    variant: {
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant',
        index: true,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    sku: {
        type: String,
        trim: true,
    },

    currency: {
        type: String,
        default: 'USD'
    },

    fulfillment_cost: {
        type: Number,
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
    },

    tax_rate: {
        type: Number,
    },

    status: {
        type: String,
        default: ''
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    },

    order_item: {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        index: true,
    },
})
