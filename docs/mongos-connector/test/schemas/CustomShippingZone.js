const {Schema} = require('mongoose')

const CustomShippingZone = new Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'CustomShippingProfile',
        required: true,
        index: true,
    },

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
}, {toJSON: {virtuals: true}})

CustomShippingZone.virtual('rates', {
    ref: 'CustomShippingRate',
    localField: '_id',
    foreignField: 'zone',
    justOne: false,
    options: {is_deleted: false}
})

module.exports = CustomShippingZone