import createError from 'http-errors'
import { User, type IUser } from '../models/User'

export class AuthAction {
  async signUp(payload: any) {
    const { email, password, firstName, lastName }: IUser = payload

    const isConflict = await User.findOne({ email })
    if (isConflict) {
      throw createError.Conflict(`${email} is already`)
    }

    return User.create({
      ...payload,
      email,
      password,
      firstName,
      lastName
    })
  }
}
