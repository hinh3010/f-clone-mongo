const {Schema} = require('mongoose')

const InvoiceCharge = new Schema({
    ffm_charge_id: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },

    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
        index: true,
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        index: true,
        required: true,
    },

    percent: {
        type: Number,
        default: 0
    },

    amount: {
        type: Number,
        required: true,
    },

    price: {
        type: Number
    },

    reason_for_seller: {
        type: String,
        trim: true
    },

    supporter: {
        type: String,
        required: true
    },

    status: {
        type: String,
        index: true,
        default: 'pending',
        enum: ['paid', 'pending']
    },

    push_to_fulfillment_status: {
        type: String,
        index: true,
        default: 'pending',
        enum: [
            'pending',
            'failed',
            'cancelled',
            'pushed',
        ]
    },

    push_to_fulfillment_retry: {
        type: Number,
        index: true,
        default: 0,
    },

    push_to_fulfillment_maxretry: {
        type: Number,
        default: 3,
    },

    push_to_fulfillment_at: {
        type: Date,
    },

    meta: {
        type: Schema.Types.Mixed,
    },

    paid_at: { // time charged create via FFM
        index: true,
        type: Date, 
    },

    paid_by_method: {
        type: String,
        enum: ['balance', 'paypal'],
        index: true
    },

    paid_meta_data: {
        type: Schema.Types.Mixed,
        default: {}
    },

    updated: {
        type: Date
    },

    created: {
        type: Date,
        default: Date.now
    }
})


module.exports = InvoiceCharge
