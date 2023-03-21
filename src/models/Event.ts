import { model, Schema } from 'mongoose'
import { BaseDoc, FILE_TYPES, type IBaseDoc } from '.'
import { locationDoc, type ILocationDoc } from './Location'

export interface IEvent extends IBaseDoc {
  title: string
  startTime: Date
  endTime: Date
  location?: ILocationDoc
  description?: string
  attachments?: Array<{
    fileUrl: string
    fileType: FILE_TYPES
    thumbnail: string
  }>
  meta?: any
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    location: locationDoc,
    description: { type: String },
    attachments: [
      {
        fileUrl: {
          type: String,
          required: false
        },
        fileType: {
          type: String,
          enum: Object.values(FILE_TYPES),
          required: false
        },
        thumbnail: {
          type: String,
          required: false
        }
      }
    ],
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

export const Event = model<IEvent>('Event', EventSchema)
