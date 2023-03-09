const {Schema} = require('mongoose')

module.exports = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        index: true,
        maxlength: 255,
    },
    location: {
        type: String,
        trim: true,
        index: true,
        default: 'header',
        enum: [
            'header',
            'footer',
            'side_left',
            'side_right',
            '',
        ],
    },
    is_deleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    created: {
        type: Date,
        default: Date.now,
        index: true,
    },
    modified: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'modified',
    },
})