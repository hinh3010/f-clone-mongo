const {Schema} = require('mongoose')

const WoocommerceCredential = new Schema({
    credentials: {
        type: Schema.Types.Mixed,
        default: {}
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

module.exports = WoocommerceCredential
