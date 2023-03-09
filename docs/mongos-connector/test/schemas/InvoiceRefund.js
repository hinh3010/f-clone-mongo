const {Schema} = require('mongoose')

module.exports = new Schema({
    invoice: {
        type: Schema.Types.ObjectId,
        ref: 'Invoice',
        index: true,
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        index: true,
        required: true,
    },

    ffm_refund_id: {
        type: String,
        required: true,
        index: true,
    },

    percent: {
        type: Number,
    },

    price: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'processing', 'paid'],
        default: 'pending',
        index: true,
        required: true,
    },

    // trạng thái để biết đồng bộ sang bên manger
    fulfillment_status_manager: {
        type: String,
        trim: true,
        default: 'error',
        enum: ['error', 'success'],
        index: true,
    },

    currency: {
        type: String,
        default: 'USD',
        required: true,
    },

    reason_for_seller: {
        type: String,
    },

    reason: {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        updated: {
            type: Date,
        },
        created: {
            type: Date,
        },
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    },

    paid_at: {
        type: Date,
    },

    paid_by_method: {
        type: String,
        enum: ['balance', 'paypal'],
    },

    paid_meta_data: {
        type: Schema.Types.Mixed,
        default: {}
    }
})
