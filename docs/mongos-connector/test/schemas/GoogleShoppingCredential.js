const {Schema} = require('mongoose')

const GoogleShoppingCredential = new Schema({
    credentials: {
        type: Schema.Types.Mixed,
        default: {}
    },

    merchant_id: {
        type: String,
        trim: true,
    },

    status: {
        type: String,
        default: 'active',
        index: true
    },

    revoked_at: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    }
})

GoogleShoppingCredential.index({status: 1, created: -1})

module.exports = GoogleShoppingCredential
