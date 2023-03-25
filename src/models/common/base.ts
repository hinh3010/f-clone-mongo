import { type ObjectId } from 'mongodb'
import { Schema } from 'mongoose'

export interface IBaseDoc {
  createdById: ObjectId
  updatedById: ObjectId
  deletedAt: Date
  deletedById: ObjectId
}

export const BaseDoc = {
  updatedById: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdById: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: { type: Date, required: false },
  deletedById: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  }
}
