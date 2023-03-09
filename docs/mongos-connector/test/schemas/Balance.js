const { Schema } = require('mongoose')

module.exports = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        index: true,
    },
    deposit_id: {
        type: Schema.Types.ObjectId,
        index: true
    },
    note: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },

    message: {
        type: String
    },

    created: {
        type: Date,
        default: Date.now,
        index: true,
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {}
    }
})
