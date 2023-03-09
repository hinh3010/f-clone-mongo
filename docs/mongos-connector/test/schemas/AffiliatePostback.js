const {Schema} = require('mongoose')

const AffiliatePostbackSchema = new Schema({
    affiliate: {
        type: String,
        trim: true,
        required: true,
        index: true,
        maxlength: 255,
    },
    baseurl: {
        type: String,
        trim: true,
        index: true,
    },
    accessKey: {
        type: String,
        trim: true,
        index: true,
    },
    orderId: {
        type: String,
        trim: true,
        index: true,
    },
    status: {
        type: String,
        trim: true,
        index: true,
    },
    reason: {
        type: String,
        trim: true,
        index: true,
    },
    payload: {
        type: Schema.Types.Mixed,
    },
    method: {
        type: String,
        trim: true,
        index: true,
    },
    result: {
        type: Schema.Types.Mixed,
    },
    success: {
        type: Boolean,
        default: false,
        index: true,
    },
    is_retried: {
        type: Boolean,
        default: false,
        index: true,
    },
    retry: {
        type: Number,
        index: true,
        default: 0,
    },
    max_retry: {
        type: Number,
        default: 3
    },
    next_retry_at: {
        type: Date,
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

AffiliatePostbackSchema.index({
    'result.name': 1,
    'payload.conversion_id': 1
})

module.exports = AffiliatePostbackSchema