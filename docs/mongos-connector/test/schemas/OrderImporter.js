const {Schema} = require('mongoose')

const OrderImporter = new Schema({
    number: {
        type: String,
        trim: true,
        index: true,
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
    },

    type: {
        type: String,
        trim: true,
    },

    data: {
        type: Schema.Types.Mixed,
        default: [],
    },

    status: {
        type: String,
        trim: true,
        default: 'pending',
        index: true,
    },

    updated: {
        type: Date,
    },

    is_deleted: {
        type: Boolean,
        default: false,
        index: true,
    },

    deleted_at: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now,
        index: true,
    },

    file_name: {
        type: String
    },

    error: {
        type: String
    },

    hidden: {
        type: Boolean,
        default: false
    }
})

OrderImporter.index({number: 1, type: 1})
OrderImporter.index({
    order: 1,
    status: 1,
    type: 1
})
OrderImporter.index({
    "data.identifer": 1,
    "data.order_id": 1,
    status: 1,
    type: 1
})
OrderImporter.index({
    "data.identifer": 1,
    "data.order_id": 1,
    type: 1
})

module.exports = OrderImporter
