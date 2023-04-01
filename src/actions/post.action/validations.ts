import { FILE_TYPE, POST_TYPE, POST_VISIBLE_TYPE, type IPost } from '@hellocacbantre/db-schemas'
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

const _locationSchema = Joi.object({
  country: Joi.custom(_customValidations.objectId).optional(),
  province: Joi.custom(_customValidations.objectId).optional(),
  district: Joi.custom(_customValidations.objectId).optional(),
  ward: Joi.custom(_customValidations.objectId).optional(),
  street: Joi.custom(_customValidations.objectId).optional(),
  other: Joi.string().optional()
}).optional()

const _shareSchema = Joi.object({
  postId: Joi.custom(_customValidations.objectId).required(),
  sharedAt: Joi.date().required()
}).optional()

export const validateBeforeCreatePost = (payload: IPost) => {
  const schema = Joi.object<IPost>({
    content: Joi.string().optional(),

    attachments: Joi.array()
      .items(_attachmentSchema)
      .custom((value, helpers: any) => {
        if (!value?.length) {
          return helpers.message('"attachments" must not be an empty array')
        }
        return value
      }),
    backgroundId: Joi.custom(_customValidations.objectId).optional(),

    visibility: Joi.string()
      .valid(...Object.values(POST_VISIBLE_TYPE))
      .optional(),

    type: Joi.string()
      .valid(...Object.values(POST_TYPE))
      .optional(),

    tags: Joi.array().items(Joi.custom(_customValidations.objectId)).optional(),

    hashTags: Joi.array().items(Joi.string()).optional(),

    location: _locationSchema.custom((value, helpers: any) => {
      if (!Object.keys(value).length) {
        return helpers.message('"location" must not be an empty object')
      }
      return value
    }),

    shares: _shareSchema,

    eventId: Joi.custom(_customValidations.objectId).optional(),
    pollId: Joi.custom(_customValidations.objectId).optional(),

    createdById: Joi.custom(_customValidations.objectId).required()
  }).or('content', 'attachments', 'location', 'eventId', 'pollId', 'shares')

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

export const validateBeforeUpdatePost = (payload: any) => {
  const schema = Joi.object({
    content: Joi.string().optional(),
    attachments: Joi.array().items(_attachmentSchema),
    backgroundId: Joi.custom(_customValidations.objectId).optional(),
    visibility: Joi.string()
      .valid(...Object.values(POST_VISIBLE_TYPE))
      .optional(),
    tags: Joi.array().items(Joi.custom(_customValidations.objectId)).optional(),
    hashTags: Joi.array().items(Joi.string()).optional(),
    location: _locationSchema,

    postId: Joi.custom(_customValidations.objectId).optional(),
    userRequestId: Joi.custom(_customValidations.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

export const validateWhenSearchPost = (payload: any) => {
  const schema = Joi.object({
    userTargetId: Joi.custom(_customValidations.objectId).optional(),
    postId: Joi.custom(_customValidations.objectId).optional(),
    userRequestId: Joi.custom(_customValidations.objectId).required(),
    page: Joi.number().default(1).min(1),
    perPage: Joi.number().default(10).min(1)
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}
