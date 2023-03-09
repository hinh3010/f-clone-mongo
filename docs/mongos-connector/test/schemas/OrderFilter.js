const {Schema} = require('mongoose')

const Filter = new Schema({
    _id: false,

    payment_status: {
        type: String,
        trim: true,
        enum: ['pending', 'paid', 'refunded']
    },
    fulfillment_status: {
        type: String,
        trim: true,
        enum: ['unfulfilled', 'on-hold', 'fulfilled', 'partial']
    },
    shipment_status: {
        type: String,
        trim: true,
        enum: ['created', 'unknown', 'pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'return_to_sender', 'failure', 'cancelled', 'expired']
    },
    tracking_status: {
        type: String,
        trim: true,
        enum: ['completed', 'incomplete', 'missing']
    },
    validate_shipping_address:{
        type: String,
        trim: true,
        enum: ['pending', 'invalid', 'valid', 'valid-buyer-confirmed', 'ignored']
    },
    push_to_fulfillment_progress: {
        type: String,
        trim: true,
        enum: ['paused']
    },
    tags: {
        type: [String]
    },
    code: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    full_name: {
        type: String,
        trim: true,
    },
    external_number: {
        type: String,
        trim: true
    },
    fulfill_manually: {
        type: String,
        trim: true,
        enum: ['seller', 'to-be-decided', 'merchize']
    },
    artwork_status: {
        type: String,
        trim: true,
        enum: ['completed', 'incomplete', 'missing']
    },
    paid_at: {
        type: Object
    },
    product: {
        type: Object
    }
})

module.exports = new Schema({
    title: {
        type: String,
        trim: true
    },
    owners: {
        type: [Schema.Types.ObjectId],
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    meta: {
        type: Filter,
        default: {}
    }
})
