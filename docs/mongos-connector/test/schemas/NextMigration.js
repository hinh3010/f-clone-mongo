const {Schema} = require('mongoose')

const NextMigration = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

    count_run: {
        type: Number,
        default: 1
    },

    last_completed_at: {
        type: Date
    },

    last_error_message: {
        type: String,
    },

    status: {
        type: String,
        default: '',
        enum: ['running', 'failed', 'completed']
    },

    updated_at: {
        type: Date,
        default: Date.now,
    },

    created_at: {
        type: Date,
        default: Date.now,
    }
})

module.exports = NextMigration
