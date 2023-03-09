const {Schema} = require('mongoose')
const randToken = require('rand-token')

module.exports = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: function () {
            return this.type === 'profit' || this.type === 'cancellation'
        },
        index: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    estimated_profit: {
        type: Number,
        required: true,
    },

    profit: {
        type: Number,
        required: true,
        index: true,
    },

    status: {
        type: String,
        enum: ['pending', 'cancelled', 'rejected', 'approved'],
        default: 'pending'
    },

    fulfilled_at: {
        type: Date,
        index: true
    },

    cancelled_at: {
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

    message: {
        type: String
    },

    is_cancellation: {
        type: Boolean,
        default: false,
        index: true
    },

    profit_adjustment_manager_id: {
        type: Schema.Types.ObjectId,
        index: true
    },

    type: {
        type: String,
        enum: ['profit', 'cancellation', 'payout'],
        default: 'profit',
        index: true
    },

    transaction_id: {
        type: String,
        index: true,
        unique: true
    },

    gateway: {
        type: String
    },

    account: {
        type: String
    },

    owner_confirm_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    updated: {
        type: Date,
        default: Date.now
    }
}).pre('save', function(next) {
    if (!this.transaction_id) {
        this.transaction_id = randToken.uid(40)
    }
    next()
})