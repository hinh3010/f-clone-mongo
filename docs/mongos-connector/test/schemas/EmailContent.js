const {Schema} = require('mongoose')

const EmailContent = new Schema({
    template: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },

    position: {
        type: String,
        trim: true,
        required: true,
    },

    content: {
        type: String,
        trim: true,
        default: '',
    },

    created: {
        type: Date,
        default: Date.now,
    },

    updated: {
        type: Date,
    }
})

module.exports = EmailContent
