const {Schema} = require('mongoose')

const AmzSyncTrackingJobs = new Schema({
    order_importer: {
        type: Schema.Types.Mixed,
    },

    fulfillment_id: {
        type: String,
    },

    tracking: {
      type: Schema.Types.Mixed,
    },
    
    status: {
      type: Schema.Types.String,
      default: 'pending'
    },

    created: {
      type: Schema.Types.Date,
      default: new Date()
    }
})

module.exports = AmzSyncTrackingJobs
