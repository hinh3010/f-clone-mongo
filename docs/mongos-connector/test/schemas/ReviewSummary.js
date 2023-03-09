const {Schema} = require("mongoose");

function _isRequireProductInfo() {
    return this.type === "product"
}

const ReviewSummary = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: _isRequireProductInfo,
    },
    rating: {
        type: Object // { "1": 12, "2": 23, "3": 47, "4": 101, "5": 7 }
    },
    total: {
        type: Number
    },
    type: {
        type: String,
        trim: true,
        default: "product",
        enum: ["product", "store"],
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
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    },
});

module.exports = ReviewSummary;
