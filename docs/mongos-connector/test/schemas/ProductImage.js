const {Schema} = require('mongoose')

const Image = new Schema({
    _id: false,

    is_default: {
        type: Boolean,
        default: true
    },

    type: {
        type: String,
    },

    image_id: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }
})

module.exports = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true
    },

    images: [{
        type: Image
    }],

    variants: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant',
        index: true
    }]
})