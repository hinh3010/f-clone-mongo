const {Schema} = require('mongoose')


const ShopBaseCredential = new Schema({
    shop: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },

    key: {
        type: String,
        trim: true,
        required: true
    },

    password: {
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
        type: Date
    },

    last_synced_at: {
        type: Date
    },

    updated: {
        type: Date
    },

    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = ShopBaseCredential
