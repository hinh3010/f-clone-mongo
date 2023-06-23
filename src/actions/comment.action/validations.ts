import { COMMENT_ENTITY_TYPE, FILE_TYPE, type IComment } from '@hellocacbantre/db-schemas'
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

const _attachmentSchema = Joi.object({
  fileUrl: Joi.string().optional(),
  fileType: Joi.string()
    .valid(...Object.values(FILE_TYPE))
    .optional(),
  thumbnail: Joi.string().optional()
}).optional()

export const validateBeforeCreateComment = (payload: IComment) => {
  const schema = Joi.object<IComment>({
    content: Joi.string().optional(),
    attachments: _attachmentSchema,
    entityId: Joi.custom(_customValidations.objectId).required(),
    entityType: Joi.string()
      .valid(...Object.values(COMMENT_ENTITY_TYPE))
      .required(),
    // parentId: Joi.custom(_customValidations.objectId).allow(null).default(null).optional(),
    // level: Joi.number().when('parentId', {
    //   is: Joi.exist().not(null),
    //   then: Joi.number().min(1).max(3).optional(),
    //   otherwise: Joi.number().valid(0).optional()
    // }),
    tags: Joi.array().items(Joi.custom(_customValidations.objectId)).optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),
    createdById: Joi.custom(_customValidations.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

export const validateBeforeUpdateComment = (payload: any) => {
  const schema = Joi.object({
    content: Joi.string().optional(),
    attachments: Joi.array().items(_attachmentSchema),
    backgroundId: Joi.custom(_customValidations.objectId).optional(),
    tags: Joi.array().items(Joi.custom(_customValidations.objectId)).optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),

    commentId: Joi.custom(_customValidations.objectId).optional(),
    userRequestId: Joi.custom(_customValidations.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

export const validateWhenDeleteComment = (payload: any) => {
  const schema = Joi.object({
    commentId: Joi.custom(_customValidations.objectId).optional(),
    userRequestId: Joi.custom(_customValidations.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}
