const {Schema} = require('mongoose')

module.exports = new Schema({
    code: {
        type: String,
        index: true,
        unique: true,
        required: true,
        trim: true,
    },

    type: {
        type: String,
        enum: ['percentage', 'fixed', 'offer_percentage'],
        required: true,
    },

    rule: {
        type: Schema.Types.Mixed,
    },

    starts_at: {
        type: Date,
        default: Date.now,
    },

    expires_at: {
        type: Date,
        // require: true,
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        index: true,
        required: true,
    },

    uses: {
        type: Number,
        default: 0,
    },

    max_uses: {
        type: Number,
        default: -1,
    },

    caused_by: {
        type: Schema.Types.Mixed,
    },

    created: {
        type: Date,
        default: Date.now
    },

    updated: {
        type: Date,
        default: Date.now
    },
})
