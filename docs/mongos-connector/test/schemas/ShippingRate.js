const {Schema} = require('mongoose')

const ShippingRate = new Schema({
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'ShippingZone',
        required: true,
        index: true,
    },

    title: {
        type: String,
        trim: true,
        required: true,
    },

    subtitle: {
        type: String,
        trim: true,
        default: '',
    },

    fulfillment_plan: {
        type: String,
        trim: true
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
        default: Date.now,
    },

    updated: {
        type: Date,
    },

    prefer: {
        type: String,
        enum: ['min', 'max'],
        default: 'max'
    }
})

module.exports = ShippingRate
