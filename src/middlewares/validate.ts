
import { type NextFunction, type Request, type Response } from 'express'
import Joi from 'joi'
import { pick } from '../utils/pick'

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body'])
  const object = pick(req, Object.keys(validSchema))
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details.map((details: { message: any }) => details.message).join(', ')
    next(errorMessage); return
  }
  Object.assign(req, value)
  next()
}

export default validate
