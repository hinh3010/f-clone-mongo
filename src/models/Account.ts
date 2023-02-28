import { Schema, model, type ObjectId, Model } from 'mongoose'

interface IAccount {
  firstName: string
  lastName: string
  reverseName: boolean

  email: string
  password: string
  phoneNumber: string
  verified: boolean

  avatarUrl: string
  coverImageUrl: string
  status: string
  dateOfBirth: Date
  gender: string

  roles: string[]
  referralCode: string
  inviteCode: string

  deletedAt: Date
  deletedById: ObjectId
}

const AccountSchema = new Schema<IAccount>(
  {
    firstName: {
      type: String,
      require: true
    },

    lastName: {
      type: String,
      require: true
    },

    reverseName: {
      type: Boolean,
      default: false
    },

    email: {
      type: String
    },

    password: {
      type: String,
      private: true,
      select: false
    },

    phoneNumber: {
      type: String
    },

    avatarUrl: {
      type: String,
      default: null
    },
    coverImageUrl: {
      type: String,
      default: null
    },
    status: {
      type: String
    },

    gender: {
      type: String
    },

    deletedAt: {
      type: Date,
      required: false
    },

    deletedById: {
      type: Schema.Types.ObjectId
    }
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

// AccountSchema.virtual('age').get(function () {
//   const dob = new Date(this.dob)
//   const now = new Date()
//   const diffMs = now - dob.getTime()
//   const ageDt = new Date(diffMs)
//   return Math.abs(ageDt.getUTCFullYear() - 1970)
// })

AccountSchema.virtual('fullName').get(function (this: IAccount) {
  return this.reverseName
    ? `${this.firstName} ${this.lastName}`
    : `${this.lastName} ${this.firstName}`
})

export const Account: Model<IAccount> = model('Account', AccountSchema)
