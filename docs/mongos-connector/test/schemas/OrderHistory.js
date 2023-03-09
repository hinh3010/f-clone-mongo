const {Schema} = require('mongoose')

module.exports = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true,
    },

    event: {
        type: String,
        trim: true,
    },

    description: {
        type: String,
        trim: true
    },

    value: {
        type: Schema.Types.Mixed,
        default: {}
    },

    created: {
        type: Date,
        required: true,
        index: true,
        default: Date.now,
    }
})
