const {Schema} = require('mongoose')

const ShippingRule = new Schema({
    rate: {
        type: Schema.Types.ObjectId,
        ref: 'ShippingRate',
        required: true,
        index: true,
    },

    type: {
        type: String,
        trim: true,
        enum: ['weight_based', 'price_based', 'item_based'],
        required: true,
    },

    created: {
        type: Date,
        required: true,
        default: Date.now,
    },

    data: {
        type: Schema.Types.Mixed,
        default: {}
    },

    updated: {
        type: Date,
    },

    is_deleted: {
        type: Boolean,
        default: false,
    },

    deleted_at: {
        type: Date,
    }
})

module.exports = ShippingRule
