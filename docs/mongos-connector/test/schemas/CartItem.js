const {Schema} = require('mongoose')

module.exports = new Schema({
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
        index: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
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

    currency: {
        type: String,
        default: 'USD'
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

    customizes: [{
        type: Schema.Types.Mixed,
    }],

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    }
})
