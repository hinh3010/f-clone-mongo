const {Schema} = require('mongoose')

const user = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    IP: {
        type: String
    }
})

const Deposit = new Schema({
    amount: {
        type: Number,
        required: true
    },

    transaction_id: {
        type: String
    },

    requested_by: {
        type: user
    },

    approved_by: {
        type: user
    },

    rejected_by: {
        type: user
    },

    note: {
        type: String,
        default: ''
    },

    status: {
        type: String,
        enum: ['pending', 'cancelled', 'rejected', 'approved'],
        default: 'pending'
    },

    confirmed_at: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    },

    gateway: {
        type: String,
        default: 'payoneer'
    },

    sync_to_manager: {
        type: String,
        default: 'not_synced',
        index: true
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {},
    }
})

Deposit.index({
    "meta": 1,
    "meta.write_google_sheet": 1,
})

module.exports = Deposit

