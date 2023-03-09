const { Schema } = require('mongoose')

module.exports = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        index: true,
        required: true,
    },

    related_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        index: true,
        required: true,
    },

    is_deleted: {
        type: Boolean,
        default: false
    },

    position: {
        type: Number,
        required: true
    },

    created: {
        type: Date
    },

    updated: {
        type: Date
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    },
})