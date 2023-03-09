const {Schema} = require('mongoose')

module.exports = new Schema({
    created: {
        type: Date,
        default: Date.now
    }
})
