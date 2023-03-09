const {Schema} = require('mongoose')

module.exports = new Schema({
    owners: {
        type: [Schema.Types.ObjectId],
        index: true,
    },

    email: {
        type: String,
        index: true,
        required: true,
        trim: true
    },

    updated: {
        type: Date,
    },

    created: {
        type: Date,
        default: Date.now
    },
})
