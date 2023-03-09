const {Schema} = require('mongoose')

module.exports = new Schema({
    amount: {
        type: Number,
        required: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    account: {
        type: String,
        trim: true,
    },

    transaction_id: {
        type: String,
        trim: true,
    },

    note: {
        type: String,
        default: '',
        trim: true,
    },

    status: {
        type: String,
        enum: ['pending', 'cancelled', 'rejected', 'approved'],
        default: 'pending'
    },

    confirmed_at: {
        type: Date,
    },

    rejected_at: {
        type: Date,
    },

    approved_at: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    },

    gateway: {
        type: String,
        default: 'payoneer'
    }
})
