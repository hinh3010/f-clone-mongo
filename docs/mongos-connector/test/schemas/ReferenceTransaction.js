const {Schema} = require('mongoose')

const ReferenceTransaction = new Schema({
    payment_account: {
        type: Schema.Types.ObjectId,
        ref: 'PaymentAccount',
        index: true,
    },
    
    payment_id: {
        type: String,
        trim: true,
    },

    meta: {
        type: Schema.Types.Mixed,
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
    }
})

module.exports = ReferenceTransaction
