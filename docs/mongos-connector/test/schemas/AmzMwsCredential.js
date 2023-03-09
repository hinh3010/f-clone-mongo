const {Schema} = require('mongoose')

const AmzMwsCredential = new Schema({
    name: {
        type: String,
    },
    amz_mws_auth_token: {
        type: String,
    },

    amz_seller_id: {
        type: String,
    },

    amz_marketplace_id: {
        type: Array,
        default: []
    },

    status: {
        type: String,
        default: 'active',
        index: true
    },

    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = AmzMwsCredential
