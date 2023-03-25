import bcrypt from 'bcrypt'
import { Schema, type ObjectId } from 'mongoose'

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
  verifisType?: VERIFIS_TYPE[]

  avatarUrl?: string
  coverImageUrl?: string
  status?: STATUS_TYPE
  dateOfBirth?: Date
  gender?: GENDER_TYPE

  roles?: ROLES_TYPE[]
  referralCode: string
  inviteCode: string

  deletedAt?: Date
  deletedById?: ObjectId

  accountType?: ACCOUNT_TYPE
  meta?: any

  isValidPassword: (password: string) => Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    reverseName: { type: Boolean, default: false },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      // Convert email to lowercase before saving to database
      transform: function (email: string) {
        return email.toLowerCase()
      }
    },
    password: { type: String, required: true, private: true },
    phoneNumber: { type: String },

    verifisType: {
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

UserSchema.pre('save', async function (next) {
  try {
    if (this.accountType !== ACCOUNT_TYPE.Account) next()
    if (!this.isModified('password')) next()

    // Generate a salt
    const salt = bcrypt.genSaltSync(10)
    // Generate a password hash (salt + hash)
    const passwordHashed = bcrypt.hashSync(this.password, salt)
    // Re-assign password hashed
    this.password = passwordHashed

    next()
  } catch (error: any) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  try {
    return bcrypt.compareSync(password, this.password)
  } catch (error: any) {
    throw new Error(error)
  }
}

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password
    return ret
  }
})

export default UserSchema
