const {Schema} = require('mongoose')

module.exports = new Schema({
    branding_cost: {
        type: Number
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        index: true
    },

    shipment_status: {
        type: String,
        trim: true,
        index: true,
    },

    shipment_histories: {
        type: [Schema.Types.Mixed],
        default: []
    },

    fulfilment_ref_id: {
        type: String,
        index: true,
    },

    shipping_cost: {
        type: Number,
    },

    shipping_address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
    },

    tracking_number: {
        type: String,
        trim: true
    },

    tracking_url: {
        type: String,
        trim: true
    },

    tracking_company: {
        type: String,
        trim: true
    },

    notify_customer: {
        type: Boolean,
        default: true,
    },

    status: {
        type: String,
        trim: true,
        index: true,
        default: 'success'
    },

    service: {
        type: String,
        trim: true,
        default: 'manual',
    },

    name: {
        type: String,
        trim: true,
    },

    production_status: {
        type: Object,
    },

    created: {
        type: Date,
        default: Date.now,
    },

    updated: {
        type: Date,
    }
})
