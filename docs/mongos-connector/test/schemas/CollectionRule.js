const {Schema} = require('mongoose')

const CollectionRule = new Schema({
    _id: false,

    column: {
        type: String,
    },

    relation: {
        type: String,
        default: 'equals'
    },

    condition: {
        type: String,
    }
})

module.exports = CollectionRule
