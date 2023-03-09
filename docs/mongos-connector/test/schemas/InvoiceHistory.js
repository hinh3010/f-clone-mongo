const {Schema} = require('mongoose')

module.exports = new Schema({
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true,
        index: true
    },

    event: {
        type: String,
        trim: true
    },

    description: {
        type: String
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {}
    },

    created: {
        type: Date,
        default: Date.now
    }
})
