const {Schema} = require('mongoose')

const ProductUpsell = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true
    },

    upsell_product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true
    },

    discount_price: {
        type: Number,
        default: 0
    },

    is_deleted: {
        type: Boolean,
        default: false,
    },

    deleted_at: {
        type: Date,
    },

    created: {
        type: Date,
        required: true,
        default: Date.now
    },

    updated: {
        type: Date
    }
})

module.exports = ProductUpsell
