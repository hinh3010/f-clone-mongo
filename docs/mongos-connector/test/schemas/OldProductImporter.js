const {Schema} = require('mongoose')

module.exports = new Schema({
    url: {
        type: String,
        trim: true,
        required: true,
    },

    title: {
        type: String,
        trim: true,
    },

    tags: {
        type: [String],
        default: []
    },

    collections: {
        type: [Schema.Types.ObjectId],
        ref: 'Collection',
        default: []
    },

    status: {
        type: String,
        required: true,
        trim: true,
        index: true,
        default: 'pending',
    },

    prevStatus: {
        type: String,
        trim: true,
        default: ''
    },

    data: {
        type: Schema.Types.Mixed,
        default: {},
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now,
    },

    migrated_at: {
        type: Date,
    },

    is_migrated: {
        type: Boolean,
        default: false,
        index: true,
    }
}, {
    collection: 'productimporter'
})
