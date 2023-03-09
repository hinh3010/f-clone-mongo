const {Schema} = require('mongoose')

const InvoiceTransactionFee = new Schema({
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
        index: true
    },

    transaction: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        index: true
    },

    price: {
        type: Number,
        required: true
    },

    rate: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'refunded'],
        default: 'pending',
        index: true
    },

    currency: {
        type: String,
        default: 'USD'
    },

    created: {
        type: Date,
        default: Date.now
    },

    paid_at: {
        type: Date,
        index: true
    },
    
    paid_by_method: {
        type: String,
        enum: ['balance', 'paypal'],
        index: true
    },

    paid_meta_data: {
        type: Schema.Types.Mixed,
        default: {}
    }
})

InvoiceTransactionFee.index({
    status: 1,
    price: -1
})

module.exports = InvoiceTransactionFee
