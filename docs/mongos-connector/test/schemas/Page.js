const {Schema} = require('mongoose')

const Page = new Schema({
    title: {
        type: String,
        trim: true,
    },

    slug: {
        type: String,
        trim: true,
        index: true,
    },

    content: {
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

module.exports = Page
