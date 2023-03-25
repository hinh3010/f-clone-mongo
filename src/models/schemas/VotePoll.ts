import { Schema, type ObjectId } from 'mongoose'
import { BaseDoc, type IBaseDoc } from '../common/base'

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

export default VotePollSchema
