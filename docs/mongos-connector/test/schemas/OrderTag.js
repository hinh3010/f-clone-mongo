const {Schema} = require('mongoose')

module.exports = new Schema({
    title: {
        type: String,
        trim: true,
        index: true,
    },

    status: {
        type: String,
        index: true,
        trim: true,
        default: 'active',
    },

    deleted_at: {
        type: Date,
    },

    created: {
        type: Date,
        required: true,
        index: true,
        default: Date.now,
    }
})
