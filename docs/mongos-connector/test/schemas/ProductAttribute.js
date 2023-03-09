const {Schema} = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },

    slug: {
        type: String,
        trim: true,
        required: true,
    },

    description: {
        type: String,
        trim: true
    },

    position: {
        type: Number,
        required: true
    },

    value_type: {
        type: String,
        trim: true
    },

    values: [{
        type: Schema.Types.Mixed,
        default: {}
    }],

    is_preselected: {
        type: Boolean,
        default: true
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
