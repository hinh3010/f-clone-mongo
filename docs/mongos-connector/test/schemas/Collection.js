const { Schema } = require('mongoose')
const CollectionRule = require('./CollectionRule')

const Collection = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

    is_active: {
        type: Boolean,
        default: true,
        index: true
    },

    is_deleted: {
        type: Boolean,
        default: false,
    },

    is_featured: {
        type: Boolean,
        default: false,
        index: true
    },

    description: {
        type: String,
        trim: true,
    },

    cover: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },

    cover_alt: {
        type: String,
        default: ''
    },

    type: {
        type: String,
        default: 'manual',
        enum: ['manual', 'automated']
    },

    sort_order: {
        type: String,
        default: 'created-desc',
    },

    rules: {
        type: [CollectionRule],
        default: [],
    },

    disjunctive: {
        type: Boolean,
        default: true,
    },

    products_count: {
        type: Number,
        default: 0,
    },

    template: {
        type: String,
    },

    facebook_pixel_id: {
        type: String,
        trim: true,
    },
    facebook_conversion: {
        type: String,
        trim: true,
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {},
    },

    deleted_at: {
        type: Date,
    },

    created: {
        type: Date,
        required: true,
        index: true,
        default: Date.now,
    },

    updated: {
        type: Date,
    }
})

Collection.index({ name: 'text' })
Collection.index({ is_featured: 1, created: -1 })
Collection.index({"meta.copied_from": 1})

module.exports = Collection
