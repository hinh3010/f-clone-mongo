const {Schema} = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        index: true,
        default: 'inactive',
    },

    places: {
        type: [{
            type: String,
            enum: ['thankyou', 'email'],
        }],
        default: [],
    },

    trigger: {
        type: Schema.Types.Mixed,
    },

    offer: {
        type: Schema.Types.Mixed,
    },

    priority: {
        type: Number,
        min: 1,
        max: 1001,
        default: 1001,
    },

    created: {
        type: Date,
        default: Date.now,
    },

    updated: {
        type: Date,
        default: Date.now,
    },
})
