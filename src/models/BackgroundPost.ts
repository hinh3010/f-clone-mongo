import { Schema, type Model } from 'mongoose'
import { BaseDoc, type IBaseDoc } from '.'
import { platformDb } from '../databases/mongo.db'
import validator from 'validator'

export interface IBackgroundPost extends IBaseDoc {
  name: string
  backgroundUrl: string
  textContentColor?: string
  textBackgroundColor?: string
  lengthContent?: number

  meta?: any
}

const BackgroundPostSchema = new Schema<IBackgroundPost>(
  {
    name: { type: String, required: true },
    backgroundUrl: { type: String, required: true },
    textContentColor: {
      type: String,
      default: '#FFFFFF',
      validate: {
        validator: (value: string) => validator.isHexColor(value),
        message: '{VALUE} is not a valid hex color'
      }
    },
    textBackgroundColor: {
      type: String,
      default: '#B1B4B7',
      validate: {
        validator: (value: string) => validator.isHexColor(value),
        message: '{VALUE} is not a valid hex color'
      }
    },
    lengthContent: { type: Number, default: 200 },

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

export const BackgroundPost: Model<IBackgroundPost> = platformDb.model(
  'BackgroundPost',
  BackgroundPostSchema
)
