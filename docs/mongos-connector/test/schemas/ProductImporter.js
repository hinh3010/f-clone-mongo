const {Schema} = require('mongoose')

const ProductImporter = new Schema({
    url: {
        type: String,
        trim: true,
        required: true,
    },

    title: {
        type: String,
        trim: true,
    },

    price_percentage_decrease: {
        type: Number,
        default: 0,
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        index: true,
    },

    tags: {
        type: [String],
        default: []
    },

    collections: {
        type: [Schema.Types.ObjectId],
        ref: 'Collection',
        default: []
    },

    status: {
        type: String,
        required: true,
        trim: true,
        index: true,
        default: 'pending',
    },

    previous_status: {
        type: String,
        trim: true,
        default: ''
    },

    updated: {
        type: Date,
        index: true
    },

    created: {
        type: Date,
        default: Date.now,
        index: true,
    },
})

ProductImporter.index({status: 1, created: -1})
ProductImporter.index({status: 1, updated: -1})

module.exports = ProductImporter
