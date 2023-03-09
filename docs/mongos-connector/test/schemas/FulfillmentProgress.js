const {Schema} = require('mongoose')

module.exports = new Schema({
    fulfillment: {
        type: Schema.Types.ObjectId,
        ref: 'Fulfillment',
        required: true,
        index: true,
    },

    event: {
        type: String,
        trim: true,
    },

    expected: {
        type: Date,
    },

    actual: {
        type: Date,
    },

    status: {
        type: String,
        enum: ['pending', 'warning', 'delay', 'done'],
        default: 'pending'
    },

    message: {
        type: String,
        trim: true
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {}
    }
})