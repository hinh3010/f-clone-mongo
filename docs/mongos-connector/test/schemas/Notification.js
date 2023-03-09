const {Schema} = require('mongoose')

const Notification = new Schema({
    type: {
        type: String,
        trim: true
    },

    event: {
        type: String,
        trim: true
    },

    title: {
        type: String,
        trim: true
    },

    content: {
        type: String,
        trim: true
    },

    values: [{
        type: Schema.Types.Mixed
    }],

    link: {
        type: String,
        trim: true,
    },

    source: {
        type: String,
        trim: true,
        default: 'human',
        enum: ['system', 'human']
    },

    is_read: {
        type: Boolean,
        default: false,
    },

    read_at: {
        type: Date,
    },

    send_email: {
        type: Boolean,
        default: false,
        index: true
    },

    send_email_from: {
        type: String,
        trim: true
    },

    send_email_to: {
        type: String,
        trim: true
    },

    retry_send_mail: {
        type: Number,
    },

    send_email_at: {
        type: Date
    },

    need_merge: {
        type: Boolean,
        default: false
    },

    is_merged: {
        type: Boolean
    },

    show_type: {
        type: String,
        trim: true,
        default: 'now'
    },

    show_at: {
        type: Date,
        default: Date.now,
    },

    idempotency_key: {
        type: String,
        trim: true,
        index: true,
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {}
    },

    created: {
        type: Date,
        default: Date.now,
        index: true,
    },

    updated: {
        type: Date,
    },
})

module.exports = Notification