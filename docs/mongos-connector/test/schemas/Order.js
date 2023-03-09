const { Schema } = require('mongoose')


const ExternalOrderId = new Schema({
    _id: false,

    id: {
        type: String,
        trim: true,
    },

    source: {
        type: String,
        trim: true,
    },

    identifier: {
        type: String,
        trim: true,
    }
})

const MessageVerifyShippingAddress = new Schema({
    _id: false,

    response: {
        type: Schema.Types.Mixed,
        default: {}
    },

    message: {
        type: String,
        trim: true,
    },
})

const Order = new Schema({
    branding_cost: {
        type: Number
    },
    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
    },

    ref_fulfillment: {
        type: String,
        trim: true,
        index: true
    },

    code: {
        type: String,
        index: true,
        trim: true,
        unique: true
    },

    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        index: true,
    },

    creator: {
        type: String,
        trim: true,
    },

    owners: {
        type: [Schema.Types.ObjectId],
        index: true,
        default: [],
    },

    invoice: {
        type: Schema.Types.Mixed,
        default: {}
    },

    shipping_address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
    },

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        index: true
    },

    status: {
        type: String,
        trim: true,
        index: true
    },

    payment_status: {
        type: String,
        default: 'pending',
        trim: true,
        index: true,
    },

    fulfillment_status: {
        type: String,
        trim: true,
        default: 'unfulfilled',
        enum: ['unfulfilled', 'fulfilled', 'partial', 'restocked'],
        index: true,
    },

    fulfillment_payment_status: {
        type: String,
        default: 'pending',
        trim: true,
        index: true
    },

    processed_at: {
        type: Date,
        index: true,
    },

    paid_at: {
        type: Date,
        index: true,
    },

    confirmed_at: {
        type: Date,
        index: true,
    },

    cancelled_at: {
        type: Date
    },

    returned_at: {
        type: Date
    },

    tags: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'OrderTag'
        }],
        index: true,
        default: []
    },

    fulfill_manually: {
        type: Boolean,
    },

    invoice_fulfillment: {
        type: Boolean,
        default: false
    },

    invoice_transaction: {
        type: Boolean,
        default: false
    },

    has_fulfillment_cost: {
        type: Boolean,
        default: false
    },

    total_refunded_amount: {
        type: Number,
        default: 0
    },

    updated: {
        type: Date,
        index: true,
    },

    external_order_number: {
        type: String,
        trim: true,
    },

    external_order_id: {
        type: ExternalOrderId,
        default: {},
    },

    meta: {
        type: Schema.Types.Mixed,
    },

    shipping: {
        type: Schema.Types.Mixed,
    },

    applied_discounts: [{
        type: Schema.Types.ObjectId,
        ref: 'AppliedDiscount',
    }],

    offer: [{
        type: Schema.Types.ObjectId,
        ref: 'Offer',
    }],

    artwork_status: {
        type: String,
        default: 'missing',
        enum: ['missing', 'incomplete', 'completed'],
        trim: true,
        index: true,
    },

    tracking_status: {
        type: String,
        default: 'missing',
        enum: ['missing', 'incomplete', 'completed'],
        trim: true,
        index: true,
    },

    shipment_statuses: {
        type: [String],
        default: [],
        index: true,
    },

    production_status: {
        type: [String],
        default: [],
        index: true,
    },

    // mark valid address without validate
    mark_valid_address: {
        type: Boolean,
        default: false,
    },

    // is shipping address valid? (using Smarty Streets APIs)
    validate_shipping_address: {
        type: String,
        default: 'pending',
        index: true,
        enum: ['pending', 'street_undefined', 'zipcode_undefined', 'inactive', 'missing_secondary', 'vacant', 'valid', 'ignored']
    },

    // message after checked shipping address (using Smarty Streets APIs)
    message_shipping_address: {
        type: MessageVerifyShippingAddress,
    },

    last_time_check_shipment_status: {
        type: Date,
        index: true,
    },

    last_time_check_fulfillment_progress: {
        type: Date,
        index: true,
    },

    last_check_artwork_status: {
        type: Date,
        index: true
    },

    // deprecated
    order_profit_status: {
        type: String,
        trim: true,
    },

    new_order_profit_status: {
        type: String,
        default: 'pending',
        trim: true,
    },

    products: {
        type: [Schema.Types.ObjectId],
        ref: 'Product',
        index: true
    },

    created: {
        type: Date,
        default: Date.now,
        index: true,
    },

    push_to_fulfillment_progress: {
        type: String,
        default: 'validating',
        enum: ['validating', 'scheduled', 'paused', 'pushed'],
        trim: true,
        index: true,
    },

    order_status: {
        type: String,
        trim: true,
        default: 'open',
        enum: ['open', 'archived', 'hold', 'cancelled'],
        index: true,
    },

    order_progress_status: {
        type: String,
        trim: true,
        default: 'open',
        enum: ['open', 'hold', 'cancelled'],
        index: true,
    },

    order_processing_status: {
        type: String,
        trim: true,
        default: 'pending',
        enum: ['pending', 'awaiting-confirmation', 'confirmed', 'in-production', 'shipped', 'delivered', 'returned', 'cancelled'],
        index: true,
    },

    post_back_for_access_trade: {
        type: String,
        trim: true,
        default: 'pending',
        enum: ['pending', 'fail', 'success']
    },

    // stick checkout a order by the payment gateway used before
    payment_gateway: {
        type: Schema.Types.Mixed,
        default: null,
    },

    checkout_at: {
        type: Date,
        index: true
    },

    preference: {
        generate_label_config: {
            mode: {
                type: String,
                trim: true,
                enum: ['after_pushed', 'after_days', 'after_produced'],
            },
            delay_days: {
                type: Number,
            },
        },
        thank_card: {
            thank_you_card_cost: {
                type: Number,
            },
            thank_you_card_artwork: {
                type: String,
                trim: true,
            },
            thank_you_card_title: {
                type: String,
                trim: true,
            },
            thank_you_card_artwork_url: {
                type: String,
                trim: true,
            },
            thank_you_card_artwork_preview: {
                type: String,
                trim: true,
            },
        },
    },

    refund_status: {
        type: String,
        enum: ['refund', 'partial_refund']
    },

    ioss_code: {
        type: String,
        index: true,
        default: ''
    },

    ioss_code_push_to_fulfilment_status: {
        type: String,
        index: true,
        default: 'pending',
        enum: ['pending', 'pushed', 'failed'],
    },

    ioss_code_push_to_fulfilment_at: {
        type: Date,
        index: true
    },
})

Order.index({
    payment_status: 1,
    invoice: 1,
    created: -1
})

Order.index({
    payment_status: 1,
    created: -1,
    ref_fulfillment: 1
})

Order.index({
    has_fulfillment_cost: 1,
    created: -1
})

Order.index({
    payment_status: 1,
    paid_at: -1
})

Order.index({
    payment_status: 1,
    shipment_statuses: 1
})

Order.index({
    payment_status: 1,
    validate_shipping_address: 1,
})

Order.index({
    payment_status: 1,
    validate_shipping_address: 1,
    paid_at: -1
})

module.exports = Order
