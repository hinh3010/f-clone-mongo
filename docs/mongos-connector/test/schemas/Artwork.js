const {Schema} = require('mongoose')

const Artwork = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true,
    },

    attribute: {
        type: String,
        trim: true,
    },

    level: {
        type: String,
        trim: true,
        enum: ['product', 'attribute', 'order'],
    },

    ref_fulfillment: {
        type: String,
        trim: true
    },

    is_queued_to_sync: {
        type: Boolean,
    },

    is_deleted_queued_to_sync: {
        type: Boolean,
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
        default: 'artworks',
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
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        index: true,
    },

    order_item: {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        index: true,
    },

    deleted_at: {
        type: Date,
        index: true,
    },

    deleted_reason: {
        type: String,
        trim: true,
        default: '',
    },

    is_removed_out_lib: {
        type: Boolean,
        default: false,
        index: true
    },

    removed_out_lib_at: {
        type: Date
    },

    is_thumb: {
        type: Boolean,
        default: false,
        index: true
    }
})

Artwork.index({
    ref_fulfillment: 1,
    is_deleted: 1,
    is_queued_to_sync: 1,
    is_deleted_queued_to_sync: 1,
    created: 1,
})

module.exports = Artwork
