const {Schema} = require('mongoose')

const StoreSetting = new Schema({
    key: {
        type: String,
        trim: true,
        index: true,
    },

    value: {
        type: String,
        trim: true,
    },

    created: {
        type: Date,
        required: true,
        default: Date.now,
    },

    updated: {
        type: Date,
    }
})

module.exports = StoreSetting
