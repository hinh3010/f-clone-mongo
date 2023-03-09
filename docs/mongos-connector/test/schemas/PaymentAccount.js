const {Schema} = require('mongoose')

const PaymentAccount = new Schema({
    payment_method: {
        type: String,
        trim: true,
        enum: ['paypal'],
        required: true,
    },

    position: {
        type: Number,
        min: 1,
        max: 2,
        required: true,
    },

    state: {
        type: String,
        trim: true,
        enum: ['active', 'inactive'],
        required: true
    },

    status: {
        type: String,
        trim: true,
        enum: ['available', 'unavailable'],
        required: true,
        default: 'available'
    },

    payer_info: {
        type: Schema.Types.Mixed,
        required: true,
        default: {},
    },

    funding_instruments: {
        type: Schema.Types.Mixed,
        required: true,
        default: {},
    },

    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },

    updated_at: {
        type: Date,
        required: true,
        default: Date.now,
    },

    deleted_at: {
        type: Date,
    }
})

module.exports = PaymentAccount
