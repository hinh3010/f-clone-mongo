const {Schema} = require('mongoose')

module.exports = new Schema({
    discount: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Discount'
    },

    order: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },

    discount_code: {
        type: String,
        required: true,
    },

    discount_type: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed']
    },

    amount: {
        type: Number,
    },

    amount_off: {
        type: Number,
    },

    created: {
        type: Date,
        default: Date.now
    },
})

