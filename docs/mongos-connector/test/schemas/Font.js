const {Schema} = require('mongoose')

const Font = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    displayName: {
        type: String,
        trim: true,
    },
    path: {
        type: String,
        index: true,
    },

    created: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = Font
