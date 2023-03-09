const {Schema} = require('mongoose')

module.exports = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true,
    },

    is_active: {
        type: Boolean,
        default: true
    },

    type: {
        type: String,
        default: 'front'
    },

    image: {
        type: String,
    },
    
    can_preview: {
        type: Boolean,
    },

    elements: [{
        type: Schema.Types.Mixed,
    }],

    created: {
        type: Date,
        default: Date.now,
        required: true
    },

    updated: {
        type: Date,
    }
})
