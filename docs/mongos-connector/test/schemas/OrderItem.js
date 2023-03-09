const {Schema} = require('mongoose')

const OrderItem = new Schema({
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

    base_cost: {
        type: Number,
    },

    sku: {
        type: String,
        trim: true,
    },

    sku_1c: {
        type: String,
        trim: true,
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

    estimated_profit: {
        type: Number,
    },

    profit: {
        type: Number,
        index: true,
    },

    status: {
        type: String,
        default: '',
        index: true,
    },

    customizes: [{
        type: Schema.Types.Mixed,
    }],

    updated: {
        type: Date,
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {}
    },

    artworks: [{
        type: Schema.Types.ObjectId,
        ref: 'Artwork'
    }],

    processed_artworks: [{
        type: Schema.Types.ObjectId,
        ref: 'Artwork'
    }],

    ffm_map_item_status: {
        type: String,
        trim: true,
        index: true,
        default: 'pending',
        enum: ['pending', 'processed']
    },

    created: {
        type: Date,
        default: Date.now
    },

    paid_at: {
        type: Date,
        index: true,
    },
})

OrderItem.index({status: 1, updated: 1})
OrderItem.index({'customizes.upload_dir': 1})

module.exports = OrderItem
