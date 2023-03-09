const {Schema} = require('mongoose')

const EtsyCredential = new Schema({
    shop_id: {
        type: String,
        require: true,
    },

    user_id: {
        type: String,
        require: true,
    },

    shop_name: {
        type: String,
    },

    shop_url: {
        type: String,
    },

    etsy_app_client_key: {
        type: String
    },

    etsy_app_client_secret: {
        type: String
    },

    status: {
        type: String,
        default: 'active',
        index: true,
        enum: ['active', 'revoked']
    },

    access_token: {
        type: String,
        require: true,
    },

    secret_token: {
        type: String,
        require: true,
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

module.exports = EtsyCredential