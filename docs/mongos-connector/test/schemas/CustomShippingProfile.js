const {Schema} = require('mongoose')

const CustomShippingProfile = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },

    is_general: {
        type: Boolean,
        default: false,
    },

    tags: [{
        type: String,
        trim: true,
        index: true
    }],

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

}, {toJSON: {virtuals: true}})

CustomShippingProfile.virtual('zones', {
    ref: 'CustomShippingZone',
    localField: '_id',
    foreignField: 'profile',
    justOne: false,
    options: {is_deleted: false}
})

module.exports = CustomShippingProfile