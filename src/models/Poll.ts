import { Schema, type Model } from 'mongoose'
import { BaseDoc, type IBaseDoc } from '.'
import { platformDb } from '../databases/mongo.db'

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

export const Poll: Model<IPoll> = platformDb.model('Poll', PollSchema)
