import { Schema, type Model, type ObjectId } from 'mongoose'
import { BaseDoc, FILE_TYPES, type IBaseDoc } from '.'
import { platformDb } from '../databases/mongo.db'
import { locationDoc, type ILocationDoc } from './Location'

export enum POST_VISIBLE_TYPE {
  Public = 'public',
  OnlyMe = 'only_me',
  Custom = 'custom',
  Friend = 'friend'
}

export enum POST_TYPE {
  Normal = 'normal',
  Poll = 'poll',
  Event = 'event',
  Share = 'share'
}

export interface IPost extends IBaseDoc {
  content?: string
  attachments?: Array<{
    fileUrl?: string
    fileType?: FILE_TYPES
    thumbnail?: string
  }>
  backgroundId?: ObjectId
  visibility?: POST_VISIBLE_TYPE
  type?: POST_TYPE

  tags?: ObjectId[]
  hashTags?: string[]
  location?: ILocationDoc

  shares?: {
    postId: ObjectId
    sharedAt: Date
  }

  // poll?: {
  //   question: string
  //   options: Array<{
  //     title: string
  //     description: string
  //     votes: ObjectId[]
  //   }>
  //   createdAt: Date
  //   expiresAt: Date
  // }

  eventId?: ObjectId
  pollId?: ObjectId

  meta?: any
  // feeling: any
  // actions: any
}

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: false },
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

    backgroundId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'BackgroundPost'
    },

    type: {
      type: String,
      enum: Object.values(POST_TYPE),
      default: POST_TYPE.Normal
    },

    visibility: {
      type: String,
      enum: Object.values(POST_VISIBLE_TYPE),
      default: POST_VISIBLE_TYPE.Public
    },

    tags: { type: [Schema.Types.ObjectId], default: [], ref: 'User' },
    hashTags: { type: [String], default: [] },

    location: locationDoc,

    shares: {
      postId: {
        type: Schema.Types.ObjectId,
        required: false
      },
      sharedAt: {
        type: Date,
        required: false
      }
    },

    eventId: { type: Schema.Types.ObjectId, required: false, ref: 'Event' },
    pollId: { type: Schema.Types.ObjectId, required: false, ref: 'Poll' },

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

export const Post: Model<IPost> = platformDb.model('Post', PostSchema)
