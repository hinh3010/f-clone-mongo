import { type ObjectId, Schema, type Model } from 'mongoose'
import { BaseDoc, type IBaseDoc } from '.'
import { platformDb } from '../databases/mongo.db'

export enum INTERACT_TYPE {
  Like = 'like',
  Interested = 'interested',
  WillJoin = 'will_join',
  DefinitelyJoin = 'definitely_join'
}

export interface IEventParticipant extends IBaseDoc {
  eventId: ObjectId
  interactType: INTERACT_TYPE[]
  meta?: any
}

const EventParticipantSchema = new Schema<IEventParticipant>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true, ref: 'Event' },
    interactType: {
      type: [String],
      enum: Object.values(INTERACT_TYPE),
      default: []
    },
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

export const EventParticipant: Model<IEventParticipant> = platformDb.model(
  'EventParticipant',
  EventParticipantSchema
)
