const {Schema} = require('mongoose')

module.exports = new Schema({
    type: {
        type: String,
        trim: true,
        require: true,
    },

    vendor: {
        type: String,
        trim: true
    },

    created: {
        type: Date,
        default: Date.now
    }
})
