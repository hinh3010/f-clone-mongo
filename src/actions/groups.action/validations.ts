import { type IGroup } from '@hellocacbantre/db-schemas'
import { GROUP_CATEGORY, GROUP_VISIBLE_TYPE } from '@hellocacbantre/db-schemas/dist/enums/group.enum'
import Joi from 'joi'
import { isValidObjectId, type ObjectId } from 'mongoose'

const _customValidate = {
  objectId: (value: string, helpers: any) => {
    if (!isValidObjectId(value)) {
      return helpers.message('"{{#label}}" must be a valid id')
    }
    return value as unknown as ObjectId
  }
}

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}\.com$/i
const phoneRegex: RegExp = /^(03|05|07|08|09)+([0-9]{8})\b/

interface ISchemaBeforeCreateGroup extends IGroup {
  email: string
  phone: string
}
export const validateBeforeCreateGroup = (payload: ISchemaBeforeCreateGroup): ISchemaBeforeCreateGroup => {
  const schema = Joi.object<ISchemaBeforeCreateGroup>({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().optional(),
    bannerUrl: Joi.string().optional(),
    categories: Joi.string()
      .valid(...Object.values(GROUP_CATEGORY))
      .optional(),
    visibility: Joi.string()
      .valid(...Object.values(GROUP_VISIBLE_TYPE))
      .optional(),
    createdById: Joi.custom(_customValidate.objectId).required(),
    email: Joi.string().pattern(emailRegex).optional(),
    phone: Joi.string().pattern(phoneRegex).optional()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

interface ISchemaBeforeUpdateGroup extends IGroup {
  groupId: ObjectId
  userRequestId: ObjectId
}
export const validateBeforeUpdateGroup = (payload: ISchemaBeforeUpdateGroup): ISchemaBeforeUpdateGroup => {
  const schema = Joi.object<ISchemaBeforeUpdateGroup>({
    name: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    bannerUrl: Joi.string().optional(),
    categories: Joi.string()
      .valid(...Object.values(GROUP_CATEGORY))
      .optional(),
    visibility: Joi.string()
      .valid(...Object.values(GROUP_VISIBLE_TYPE))
      .optional(),
    groupId: Joi.custom(_customValidate.objectId).required(),
    userRequestId: Joi.custom(_customValidate.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

interface ISchemaWhenSearchGroups {
  page: number
  limit: number
  name: string
  userRequestId: ObjectId
}
export const validateWhenSearchGroups = (payload: ISchemaWhenSearchGroups): ISchemaWhenSearchGroups => {
  const schema = Joi.object({
    page: Joi.number().default(1).min(1),
    name: Joi.string().optional(),
    limit: Joi.number().default(10).min(1),
    userRequestId: Joi.custom(_customValidate.objectId).optional()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

interface ISchemaWhenSearchGroup {
  groupId: ObjectId
}
export const validateWhenSearchGroup = (payload: ISchemaWhenSearchGroup): ISchemaWhenSearchGroup => {
  const schema = Joi.object({
    groupId: Joi.custom(_customValidate.objectId).required(),
    userRequestId: Joi.custom(_customValidate.objectId).optional()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

interface ISchemaWhenDeleteGroup {
  groupId: ObjectId
  userRequestId: ObjectId
}
export const validateWhenDeleteGroup = (payload: ISchemaWhenDeleteGroup): ISchemaWhenDeleteGroup => {
  const schema = Joi.object({
    groupId: Joi.custom(_customValidate.objectId).required(),
    userRequestId: Joi.custom(_customValidate.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }

  return value
}
