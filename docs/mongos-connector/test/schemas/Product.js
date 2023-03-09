const {Schema} = require('mongoose')

const Product = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

    created_by: {
        type: Schema.Types.ObjectId,
        index: true,
    },

    revision: {
        type: Schema.Types.ObjectId,
        ref: 'ProductRevision',
    },

    slug: {
        type: String,
        trim: true,
        required: true,
        index: true,
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
        trim: true,
        index: true
    }],

    collections: [{
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        index: true
    }],

    variants: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant'
    }],

    attributes: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductAttribute'
    }],

    is_draft: {
        type: Boolean,
        default: true,
    },

    is_deleted: {
        type: Boolean,
        default: false,
        index: true
    },

    is_active: {
        type: Boolean,
        default: false,
        index: true,
    },

    is_private: {
        type: Boolean,
        default: false,
        index: true,
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

    is_marketplace_visible: {
        type: Boolean,
        default: false,
    },

    is_taken_down: {
        type: Boolean,
        default: false,
    },

    has_countdown_timer: {
        type: Boolean,
        default: false,
    },

    fudge_factor: {
        type: Number,
        default: 0,
    },

    is_sold_hidden: {
        type: Boolean,
        default: false,
    },

    retail_price: {
        type: Number,
        index: true
    },

    sale_price: {
        type: Number,
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

    taken_down_at: {
        type: Date,
    },

    is_parent: {
        type: Boolean,
        default: false,
        index: true
    },

    parents: {
        type: [Schema.Types.ObjectId],
        default: [],
        index: true
    },

    template: {
        type: String,
        default: '',
        trim: true
    },

    creator: {
        type: String,
        default: 'seller',
        enum: ['seller', 'buyer', 'external'],
        trim: true,
        index: true
    },

    external_product_id: {
        type: Schema.Types.Mixed,
    },

    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
    },

    no_need_artworks: {
        type: Boolean,
        default: false,
        index: true,
    },

    approval_status: {
        type: String,
        trim: true,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },

    approved_at: {
        type: Date,
    },

    rejected_at: {
        type: Date,
    },

    artwork_separated_by: {
        type: Schema.Types.ObjectId,
        ref: 'ProductAttribute',
    },

    gallery: {
        type: [String],
        default: [],
        trim: true,
    },

    // For product personalize
    designs: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductDesign'
    }],

    seo_information:{
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
            index: true,
        },
        allow_redirect: {
            type: [String],
            default: [],
            trim: true,
            index: true,
        },
        is_redirect: {
            type: Boolean,
            default: true,
            index: true,
        }
    }
})

Product.index({title: 'text'})
Product.index({is_active: 1, is_deleted: 1, created: -1})
Product.index({is_active: 1, tags: 1})
Product.index({is_deleted: 1, is_taken_down: 1})
Product.index({is_active: 1, created: -1})
Product.index({
    is_active: 1,
    is_draft: 1,
    "meta.google_shopping_content_api_deleted": 1,
    "meta.google_shopping_content_api": 1,
    "meta.facebook_pixel_id": 1,
    "meta.facebook_pixel_ids_collection": 1,
    "seo_information.allow_redirect": 1
})

Product.index({
    is_deleted: 1,
    "meta.copied_from": 1,
})

Product.index({
    "meta.facebook_pixel_ids_collection.facebook_pixel_id": 1,
})

Product.index({is_active: 1, approval_status: 1})

module.exports = Product
