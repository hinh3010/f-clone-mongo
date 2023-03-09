const {Schema} = require('mongoose')

const Migration = new Schema({
    lastRun: {
        type: String,
        required: true,
    },
    migrations: {
        type: Array,
    },
    source: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    },
})

module.exports = Migration
