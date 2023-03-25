import { Schema } from 'mongoose'
import { BaseDoc, type IBaseDoc } from '../common/base'

export interface IPoll extends IBaseDoc {
  title: string
  options: Array<{
    title: string
    description: string
  }>
  expiresAt: Date
  meta?: any
}

const PollSchema = new Schema<IPoll>(
  {
    title: { type: String, required: true },

    ...BaseDoc,
    meta: { type: Schema.Types.Mixed, required: false }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

export default PollSchema
