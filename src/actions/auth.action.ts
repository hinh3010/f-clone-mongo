import createError from 'http-errors'
import { Account, type IAccount } from '../models/Account'

export class AuthAction {
  async signUp(payload: any) {
    const { email, password, firstName, lastName }: IAccount = payload

    const isConflict = await Account.findOne({ email })
    if (isConflict) {
      throw createError.Conflict(`${email} is already`)
    }

    return await Account.create({
      email,
      password,
      firstName,
      lastName
    })
  }
}
