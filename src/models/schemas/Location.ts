import { Schema, type ObjectId } from 'mongoose'
import { BaseDoc, type IBaseDoc } from '../common/base'

export enum LOCATION_TYPE {
  Country = 'country',
  Province = 'province',
  District = 'district',
  Ward = 'ward'
}
export interface ILocation extends IBaseDoc {
  name: string
  type: LOCATION_TYPE
  code: string

  meta?: any
}

export interface ILocationDoc {
  country?: ObjectId
  province?: ObjectId
  district?: ObjectId
  ward?: ObjectId
  other: string
}
export const locationDoc = {
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: false
  },
  province: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: false
  },
  district: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: false
  },
  ward: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: false
  },
  other: {
    type: String,
    required: false
  }
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(LOCATION_TYPE),
      default: LOCATION_TYPE.Country
    },
    code: { type: String, required: true },

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

export default LocationSchema
