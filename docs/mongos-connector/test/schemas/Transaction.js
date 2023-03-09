const {Schema} = require('mongoose')

module.exports = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ['in', 'out'],
        index: true
    },

    note: {
        type: String,
        default: ''
    },

    transaction_id: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['cancelled', "pending", 'paid', 'rejected'],
        default: 'pending'
    },
 
    meta: {
        type: Schema.Types.Mixed,
    },

    confirmed_at: {
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

    created: {
        type: Date,
        default: Date.now
    }
})