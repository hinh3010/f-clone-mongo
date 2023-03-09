const {Schema} = require('mongoose')

const ShippingCarrier = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },

    carrier_code: {
        type: String,
        trim: true,
        required: true
    },

    options: {
        type: Object,
        default: {},
    },

    active: {
        type: Boolean,
        default: true
    },

    is_default: {
        type: Boolean,
        default: false,
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
    }
})

module.exports = ShippingCarrier