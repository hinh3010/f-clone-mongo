const {Schema} = require('mongoose')

const CustomShippingRate = new Schema({
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'CustomShippingZone',
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
}, {toJSON: {virtuals: true}})

CustomShippingRate.virtual('rules', {
    ref: 'CustomShippingRule',
    localField: '_id',
    foreignField: 'rate',
    justOne: false,
    options: {is_deleted: false}
})

module.exports = CustomShippingRate