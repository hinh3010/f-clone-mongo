const {Schema} = require('mongoose')

const GoogleShoppingFeeds = new Schema({
    file_name: {
        type: String,
    },
    file_url: {
        type: String,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now(),
        index: true,
    }
})

module.exports = GoogleShoppingFeeds
