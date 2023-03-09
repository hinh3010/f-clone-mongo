const {Schema} = require('mongoose')

const CartSchema = new Schema({
    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        index: true,
        required: true,
    },

    owners: {
        type: [Schema.Types.ObjectId],
        index: true,
        default: [],
    },

    subtotal_price: {
        type: Number,
    },

    total_price: {
        type: Number,
    },

    status: {
        type: String,
        default: 'uncompleted',
        index: true,
        enum: ['completed', 'uncompleted']
    },

    completed_at: {
        type: Date,
    },

    note: {
        type: String,
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    }
})

CartSchema.index({session: 1, status: 1})

module.exports = CartSchema
