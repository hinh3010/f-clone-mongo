import { Schema, type Model, type ObjectId } from 'mongoose'
import { platformDb } from '../databases/mongo.db'

export enum ROLES_TYPE {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
  Editor = 'editor',
  Moderator = 'moderator',
  Viewer = 'viewer'
}

export enum ACCOUNT_TYPE {
  Account = 'account',
  Google = 'google',
  Facebook = 'facebook'
}

export enum STATUS_TYPE {
  InActive = 'inactive',
  Pending = 'pending',
  Active = 'active',
  Banned = 'banned'
}

export enum GENDER_TYPE {
  Male = 'male',
  Female = 'female',
  Othor = 'other',
  Unspecified = 'unspecified'
}

export enum VERIFIS_TYPE {
  Email = 'email',
  PhoneNumber = 'phone_number'
}

export interface IUser {
  firstName: string
  lastName: string
  reverseName?: boolean

  email?: string
  password: string
  phoneNumber?: string
  verifiType?: VERIFIS_TYPE[]

  avatarUrl?: string
  coverImageUrl?: string
  status?: STATUS_TYPE
  dateOfBirth?: Date
  gender?: GENDER_TYPE

  roles?: ROLES_TYPE[]
  referralCode?: string
  inviteCode?: string

  deletedAt?: Date
  deletedById?: ObjectId

  accountType?: ACCOUNT_TYPE
  meta?: any
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    reverseName: { type: Boolean, default: false },

    email: { type: String },
    password: { type: String, required: true, private: true },
    phoneNumber: { type: String },

    verifiType: {
      type: [String],
      enum: Object.values(VERIFIS_TYPE),
      default: []
    },

    avatarUrl: { type: String },
    coverImageUrl: { type: String },

    status: {
      type: String,
      enum: Object.values(STATUS_TYPE),
      default: STATUS_TYPE.InActive
    },

    dateOfBirth: { type: Date },

    gender: {
      type: String,
      enum: Object.values(GENDER_TYPE),
      default: GENDER_TYPE.Unspecified
    },

    roles: {
      type: [String],
      enum: Object.values(ROLES_TYPE),
      default: [ROLES_TYPE.User]
    },

    accountType: {
      type: String,
      enum: Object.values(ACCOUNT_TYPE),
      default: ACCOUNT_TYPE.Account
    },

    referralCode: { type: String, unique: true },
    inviteCode: { type: String },

    deletedAt: { type: Date, required: false },
    deletedById: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    },

    meta: { type: Schema.Types.Mixed }
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

UserSchema.virtual('displayName').get(function (this: IUser) {
  return this.reverseName
    ? `${this.lastName} ${this.firstName}`
    : `${this.firstName} ${this.lastName}`
})

UserSchema.virtual('age').get(function () {
  if (this.dateOfBirth) {
    const diff: number = Date.now() - this.dateOfBirth.getTime()
    const ageDate = new Date(diff)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }
  return null
})

export const User: Model<IUser> = platformDb.model('User', UserSchema)
