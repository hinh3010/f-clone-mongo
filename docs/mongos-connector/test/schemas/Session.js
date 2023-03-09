const {Schema} = require('mongoose')
const randToken = require('rand-token')

const SessionSchema = new Schema({
    token: {
        type: String,
        required: true,
        index: true,
        default: () => randToken.uid(40)
    },

    status: {
        type: String,
        default: 'active'
    },

    lastActiveTime: {
        type: Date,
        default: Date.now,
    },

    created: {
        type: Date,
        default: Date.now,
    }
})

SessionSchema.index({token: 1, status: 1})

module.exports = SessionSchema
