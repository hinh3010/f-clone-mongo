const {Schema} = require('mongoose')

module.exports = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    discount: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    created: {
        type: Date,
        default: Date.now
    },
})
