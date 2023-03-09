const {Schema} = require('mongoose')

const ShopifyCredential = new Schema({
    shop: {
        type: String,
        trim: true,
        required: true
    },

    access_token: {
        type: String,
        trim: true,
        required: true
    },

    status: {
        type: String,
        default: 'active',
        index: true,
        enum: ['active', 'revoked']
    },

    revoked_at: {
        type: Date,
    },

    last_synced_at: {
        type: Date,
    },

    updated: {
        type: Date
    },

    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = ShopifyCredential
