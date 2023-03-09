const {Schema} = require('mongoose')

const RelatedProduct = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },

    related_product: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },

    jaccard_score: {
        type: Number,
        default: 0
    },

    created: {
        type: Date,
        default: Date.now,
        required: true
    },

    updated: {
        type: Date,
    }
})

RelatedProduct.index({product: 1, jaccard_score: -1})
RelatedProduct.index({product: 1, related_product: 1})
RelatedProduct.index({product: 1, related_product: 1, jaccard_score: -1})

module.exports = RelatedProduct
