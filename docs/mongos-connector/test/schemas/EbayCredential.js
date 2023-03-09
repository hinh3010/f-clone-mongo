const {Schema} = require('mongoose')

const EbayCredential = new Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },

    access_token: {
        type: String,
        trim: true,
        required: true
    },

    refresh_token: {
        type: String,
        trim: true,
        required: true
    },

    expired: {
        type: Date
    },

    status: {
        type: String,
        default: 'active',
        index: true
    },

    client_id: {
        type: String,
    },

    redirect_uri: {
        type: String,
    },

    auto_refill: {
        type: String,
        trim: true,
        default: 'disabled',
    },

    client_secret: {
        type: String,
    },

    revoked_at: {
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

module.exports = EbayCredential
