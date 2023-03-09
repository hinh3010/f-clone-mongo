const {Schema} = require('mongoose')

const TempArtwork = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    product: {
        type: String
    },

    side: {
        type: String,
        trim: true,
        default: 'front',
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    directory: {
        type: String,
        default: 'temp-artworks',
        index: true,
    },

    size: {
        type: Number,
        default: 0,
    },

    mime_type: {
        type: String,
        default: ''
    },

    height: {
        type: Number,
        default: 0,
    },

    width: {
        type: Number,
        default: 0,
    },

    is_uploaded: {
        type: Boolean,
        default: false,
    },

    is_deleted: {
        type: Boolean,
        default: false,
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {},
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

module.exports = TempArtwork