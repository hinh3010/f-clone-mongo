import { Schema, model, type ObjectId, type Model } from 'mongoose'

enum ROLES_TYPE {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
  Editor = 'editor',
  Moderator = 'moderator',
  Viewer = 'viewer'
}

enum ACCOUNT_TYPE {
  Account = 'account',
  Google = 'google',
  Facebook = 'facebook'
}

enum STATUS_TYPE {
  InActive = 'inactive',
  Pending = 'pending',
  Active = 'active',
  Banned = 'banned'
}

enum GENDER_TYPE {
  Male = 'male',
  Female = 'female',
  Othor = 'other',
  Unspecified = 'unspecified'
}

enum VERIFIS_TYPE {
  Email = 'email',
  PhoneNumber = 'phone_number'
}

export interface IAccount {
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

const AccountSchema = new Schema<IAccount>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    reverseName: { type: Boolean, default: false },

    email: { type: String },
    password: { type: String, required: true, private: true },
    phoneNumber: { type: String },

    verifiType: {
      type: [String],
      enum: Object.keys(VERIFIS_TYPE),
      default: []
    },

    avatarUrl: { type: String },
    coverImageUrl: { type: String },

    status: {
      type: String,
      enum: Object.keys(STATUS_TYPE),
      default: STATUS_TYPE.InActive
    },
    dateOfBirth: { type: Date },

    gender: {
      type: String,
      enum: Object.keys(GENDER_TYPE),
      default: GENDER_TYPE.Unspecified
    },

    roles: {
      type: [String],
      enum: Object.values(ROLES_TYPE),
      default: [ROLES_TYPE.User]
    },

    accountType: {
      type: String,
      enum: Object.keys(ACCOUNT_TYPE),
      default: ACCOUNT_TYPE.Account
    },

    referralCode: { type: String, unique: true },
    inviteCode: { type: String },

    deletedAt: { type: Date, required: false },
    deletedById: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Account'
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

AccountSchema.virtual('fullName').get(function (this: IAccount) {
  return this.reverseName
    ? `${this.firstName} ${this.lastName}`
    : `${this.lastName} ${this.firstName}`
})

AccountSchema.virtual('age').get(function () {
  if (this.dateOfBirth) {
    const diff: number = Date.now() - this.dateOfBirth.getTime()
    const ageDate = new Date(diff)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }
  return null
})

export const Account: Model<IAccount> = model('Account', AccountSchema)
