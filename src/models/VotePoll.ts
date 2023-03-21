import { type ObjectId, Schema, type Model } from 'mongoose'
import { BaseDoc, type IBaseDoc } from '.'
import { platformDb } from '../databases/mongo.db'

export interface IVotePoll extends IBaseDoc {
  pollId: ObjectId
  optionsId: ObjectId
  meta?: any
}

const VotePollSchema = new Schema<IVotePoll>(
  {
    pollId: { type: Schema.Types.ObjectId, required: true, ref: 'Poll' },
    optionsId: { type: Schema.Types.ObjectId, required: true },

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

export const VotePoll: Model<IVotePoll> = platformDb.model(
  'VotePoll',
  VotePollSchema
)
