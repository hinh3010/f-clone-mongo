import { Schema } from 'mongoose'
import validator from 'validator'
import { BaseDoc, type IBaseDoc } from '../common/base'

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

export default BackgroundPostSchema
