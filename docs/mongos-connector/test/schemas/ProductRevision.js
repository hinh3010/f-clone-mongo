const {Schema} = require('mongoose')

const ProductRevision = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    type: {
        type: Schema.Types.ObjectId,
        ref: 'ProductType',
    },

    tags: [{
        type: String,
        trim: true
    }],

    collections: [{
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        index: true
    }],

    variants: [{
        type: Schema.Types.Mixed,
        default: {},
    }],

    attributes: [{
        type: Schema.Types.Mixed,
        default: {},
    }],

    designs: [{
        type: Schema.Types.Mixed,
        default: {},
    }],

    is_deleted: {
        type: Boolean,
        default: false,
        index: true
    },

    // Add to home page.
    is_featured: {
        type: Boolean,
        default: false,
        index: true,
    },

    is_shop_hidden: {
        type: Boolean,
        default: false,
        index: true,
    },

    is_collection_hidden: {
        type: Boolean,
        default: false,
        index: true,
    },

    // Hide from search engines.
    is_stealthy: {
        type: Boolean,
        default: false,
    },

    images: [{
        type: String
    }],

    meta: {
        type: Schema.Types.Mixed,
        default: {},
    },

    created: {
        type: Date,
        required: true,
        index: true,
        default: Date.now,
    },

    updated: {
        type: Date,
    },

    deleted_at: {
        type: Date,
    },

    template: {
        type: String,
        default: '',
        trim: true
    },

    approval_status: {
        type: String,
        trim: true,
        default: 'draft',
        enum: ['draft', 'pending', 'cancelled', 'approved', 'rejected'],
        index: true,
    },

    approved_at: {
        type: Date,
    },

    rejected_at: {
        type: Date,
    },

    gallery: {
        type: [String],
        default: [],
        trim: true,
    },

    artworks: {
        type: [Schema.Types.Mixed],
        default: [],
    },

    reject_reason: {
        type: String,
        default: '',
        required: false
    }
})

module.exports = ProductRevision
