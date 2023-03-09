const {Schema} = require('mongoose')
const ProductOption = require('./ProductOption')

const ProductVariant = new Schema({
    title: {
        type: String,
        trim: true,
    },

    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true,
    },

    affiliate_category: {
        type: Object,
        default: {}
    },

    sides: {
        type: [String],
        default: [],
    },

    image_uris: {
        type: [String],
    },

    options: [{
        type: ProductOption
    }],

    retail_price: {
        type: Number,
        default: 0,
    },

    sale_price: {
        type: Number,
        index: true,
    },

    base_cost: {
        type: Number,
        index: true,
    },

    currency: {
        type: String,
    },

    is_taxable: {
        type: Boolean,
        default: true
    },

    tax_rate: {
        type: Number
    },

    cost_per_item: {
        type: Number
    },

    sku: {
        type: String,
        trim: true
    },

    sku_1c: {
        type: String,
        trim: true
    },

    max_order_quantity: {
        type: Number
    },

    weight: {
        type: Number
    },

    height: {
        type: Number,
    },

    width: {
        type: Number,
    },

    length: {
        type: Number
    },

    is_default: {
        type: Boolean,
        required: true,
        default: false,
        index: true,
    },

    is_active: {
        type: Boolean,
        default: true,
    },

    created: {
        type: Date,
        required: true,
        default: Date.now,
        index: true,
    },

    updated: {
        type: Date,
    }
})

ProductVariant.index({product: 1, is_default: 1})

module.exports = ProductVariant