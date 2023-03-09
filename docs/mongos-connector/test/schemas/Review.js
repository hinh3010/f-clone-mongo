const { Schema } = require("mongoose");

const REVIEW_STATUS = ["published", "unpublished"]
const REVIEW_TYPE = ["product", "store"]
const SEND_EMAIL_STATUS = ["pending", "done"]

function _isRequireProductInfo() {
    return this.type === "product";
}

const Review = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: _isRequireProductInfo
    },
    product_name: {
        type: String,
        required: _isRequireProductInfo,
        index: "text"
    },
    slug: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        index: true,
    },
    content: {
        type: String,
        require: true,
        trim: true,
    },
    customer_name: {
        type: String,
        index: true,
        required: true,
        trim: true,
    },
    customer_email: {
        type: String,
        index: true,
        required: true,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updated: {
        type: Date,
        index: true,
    },
    status: {
        type: String,
        index: true,
        trim: true,
        default: "unpublished",
        enum: REVIEW_STATUS,
    },
    type: {
        type: String,
        index: true,
        trim: true,
        default: "product",
        enum: REVIEW_TYPE,
    },
    images: {
        type: Array,
    },

    status_notify_seller_email: {
        type: String,
        index: true,
        trim: true,
        default: "pending",
        enum: SEND_EMAIL_STATUS,
    },

    meta: {
        type: Schema.Types.Mixed,
        default: {},
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    },
});

module.exports = Review;
