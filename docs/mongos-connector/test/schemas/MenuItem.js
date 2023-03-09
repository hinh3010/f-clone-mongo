const {Schema} = require('mongoose')
/**
 * @description use design pattern "Model Tree Structures with Materialized Paths": https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-materialized-paths/
 * @type {module:mongoose.Schema<any>}
 */
module.exports = new Schema({
    menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
        index: true,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        index: true,
    },
    type: {
        type: String,
        trim: true,
        index: true,
        default: 'custom_link',
        enum: [
            'custom_link',
        ],
    },
    title: {
        type: String,
        trim: true,
        required: true,
        index: true,
        maxlength: 255,
    },
    link: {
        type: String,
        trim: true,
        maxlength: 2000,
    },
    path: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
        index: true,
    },
    created: {
        type: Date,
        default: Date.now,
        index: true,
    },
    modified: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'modified',
    },
})