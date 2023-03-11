import Bluebird from 'bluebird'
import createError from 'http-errors'
import { STATUS_TYPE, User, type IUser } from '../models/User'
import { JwtService } from '../services/jwt.service'
import bcrypt from 'bcrypt'

export class AuthAction {
  constructor(private readonly jwtService: JwtService = new JwtService()) {}

  async signUp(payload: any) {
    const { email, password, firstName, lastName }: IUser = payload

    const isConflict = await User.findOne({ email })

    if (isConflict) {
      throw createError.Conflict(`${email} is already`)
    }

    // Create a new user
    const newUser = new User({ firstName, lastName, email, password })
    await newUser.save()

    const { _id } = newUser

    // generate token
    const [token, refreshToken] = await Bluebird.all([
      this.jwtService.generateAccessToken({ id: _id }),
      this.jwtService.generateRefreshToken({ id: _id })
    ])

    return {
      newUser,
      token,
      refreshToken
    }
  }

  async signIn(payload: any) {
    const { email, password }: IUser = payload

    const user = await User.findOne({ email })

    if (!user) {
      throw createError.UnprocessableEntity(`${email} invalid`)
    }

    const { status, _id } = user

    if (status === STATUS_TYPE.Banned) {
      throw createError.Forbidden(`${email} banned`)
    }

    console.log(user.password)
    console.log(bcrypt.compareSync(password, user.password))
    const isCorrectPassword = await user.isValidPassword(password)
    if (isCorrectPassword) {
      throw createError.Unauthorized('password invalid')
    }

    // generate token
    const [token, refreshToken] = await Bluebird.all([
      this.jwtService.generateAccessToken({ id: _id }),
      this.jwtService.generateRefreshToken({ id: _id })
    ])

    return {
      user,
      token,
      refreshToken
    }
  }
}
