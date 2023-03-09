const {Schema} = require('mongoose')

const ShippingZone = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },

    countries: {
        type: [String],
        default: []
    },

    rest_of_world: {
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

module.exports = ShippingZone