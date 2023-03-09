const {Schema} = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },

    height: {
        type: Number,
        default: 0,
    },

    width: {
        type: Number,
        default: 0,
    },

    directory: {
        type: String,
        default: 'files',
        index: true,
    },

    manageable: {
        type: Boolean,
        default: false,
    },

    size: {
        type: Number,
        default: 0,
    },

    mime_type: {
        type: String,
        default: ''
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {},
    },

    created: {
        type: Date,
        default: Date.now
    },

    is_uploaded: {
        type: Boolean,
        default: false,
    }
})
