const { Schema } = require('mongoose')

const AmzOrderItem = new Schema({
  name: {
    type: Schema.Types.String
  },
  product_id: {
    type: Schema.Types.String
  },
  quantity: {
    type: Schema.Types.String
  },
  price: {
    type: Schema.Types.String
  },
  sku: {
    type: Schema.Types.String
  },
  image: {
    type: Schema.Types.String
  },
  attributes: {
    type: Schema.Types.Mixed
  },
  currency: {
    type: Schema.Types.String
  },
  status: {
    type: Schema.Types.String,
    default: 'wait_get_product'
  },
  marketplace_id: {
    type: Schema.Types.String,
  },
  origin: {
    type: Schema.Types.Mixed
  },
  seller_id: {
    type: Schema.Types.String,
  },
  product: {
    type: Schema.Types.Mixed
  },
  amz_order_id: {
    type: Schema.Types.String,
  }
})
AmzOrderItem.index({ status: 1 })

module.exports = AmzOrderItem