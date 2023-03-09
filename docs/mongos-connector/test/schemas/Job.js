const {Schema} = require('mongoose')

const Job = new Schema({
    state: {
        type: String,
        trim: true,
        enum: ['created', 'pending', 'queued', 'running', 'completed', 'failed', 'dead'],
        index: true,
    },

    job_ref: {
        type: String,
        trim: true,
    },

    type: {
        type: String,
        default: ''
    },

    priority: {
        type: Number,
        default: 0
    },

    attempts: {
        type: Number,
        default: 100,
    },

    data: {
        type: Schema.Types.Mixed,
        default: {},
    },

    total_queued: {
        type: Number,
        default: 0
    },

    timeout: {
        type: Number,
        default: 3600000,
    },

    delay: {
        type: String,
        default: 0
    },

    remove_on_complete: {
        type: Boolean,
        default: false
    },

    created: {
        type: Date,
        default: Date.now,
    },

    updated: {
        type: Date,
        default: Date.now,
    }
})

Job.index({state: 1, update: 1})

module.exports = Job
