import { LIKE_ENTITY_TYPE, LIKE_REACT_TYPE, type ILike } from '@hellocacbantre/db-schemas'
import Joi from 'joi'
import { isValidObjectId, type ObjectId } from 'mongoose'

const _customValidations = {
  objectId: (value: string, helpers: any) => {
    if (!isValidObjectId(value)) {
      return helpers.message('"{{#label}}" must be a valid id')
    }
    return value as unknown as ObjectId
  }
}

export const validateBeforeLike = (payload: ILike) => {
  const schema = Joi.object<ILike>({
    entityId: Joi.custom(_customValidations.objectId).required(),
    entityType: Joi.string()
      .valid(...Object.values(LIKE_ENTITY_TYPE))
      .required(),
    reactType: Joi.string()
      .valid(...Object.values(LIKE_REACT_TYPE))
      .required(),
    createdById: Joi.custom(_customValidations.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}
