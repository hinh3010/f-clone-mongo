import { PAGE_CATEGORY, PAGE_VISIBLE_TYPE, PAGE_WEBSITE_STATUS, type IPage } from '@hellocacbantre/db-schemas'
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

// const emailRegex: RegExp = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}\\.com$/i
const phoneRegex: RegExp = /^(03|05|07|08|09)+([0-9]{8})\b/

export const validateBeforeCreatePage = (payload: IPage): IPage => {
  const schema = Joi.object<IPage>({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().optional(),
    bannerUrl: Joi.string().optional(),
    categories: Joi.array()
      .items(Joi.string().valid(...Object.values(PAGE_CATEGORY)))
      .optional(),
    visibility: Joi.string()
      .valid(...Object.values(PAGE_VISIBLE_TYPE))
      .optional(),
    email: Joi.string().optional().email(),
    phone: Joi.string().pattern(phoneRegex).optional(),
    website: Joi.object({
      link: Joi.string().uri().required(),
      status: Joi.string()
        .valid(...Object.values(PAGE_WEBSITE_STATUS))
        .optional()
    }).optional(),
    createdById: Joi.custom(_customValidate.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

interface ISchemaBeforeUpdatePage extends IPage {
  pageId: ObjectId
  userRequestId: ObjectId
}
export const validateBeforeUpdatePage = (payload: ISchemaBeforeUpdatePage): ISchemaBeforeUpdatePage => {
  const schema = Joi.object<ISchemaBeforeUpdatePage>({
    name: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    bannerUrl: Joi.string().optional(),
    categories: Joi.array()
      .items(Joi.string().valid(...Object.values(PAGE_CATEGORY)))
      .optional(),
    email: Joi.string().optional().email(),
    phone: Joi.string().pattern(phoneRegex).optional(),
    visibility: Joi.string()
      .valid(...Object.values(PAGE_VISIBLE_TYPE))
      .optional(),
    website: Joi.object({
      link: Joi.string().uri().optional(),
      status: Joi.string()
        .valid(...Object.values(PAGE_WEBSITE_STATUS))
        .optional()
    }).optional(),
    pageId: Joi.custom(_customValidate.objectId).required(),
    userRequestId: Joi.custom(_customValidate.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

interface ISchemaWhenSearchPages {
  page: number
  limit: number
  name: string
  userRequestId: ObjectId
}
export const validateWhenSearchPages = (payload: ISchemaWhenSearchPages): ISchemaWhenSearchPages => {
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

interface ISchemaWhenSearchPage {
  pageId: ObjectId
  userRequestId: ObjectId
}
export const validateWhenSearchPage = (payload: ISchemaWhenSearchPage): ISchemaWhenSearchPage => {
  const schema = Joi.object({
    pageId: Joi.custom(_customValidate.objectId).required(),
    userRequestId: Joi.custom(_customValidate.objectId).optional()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

interface ISchemaWhenDeletePage {
  pageId: ObjectId
  userRequestId: ObjectId
}
export const validateWhenDeletePage = (payload: ISchemaWhenDeletePage): ISchemaWhenDeletePage => {
  const schema = Joi.object({
    pageId: Joi.custom(_customValidate.objectId).required(),
    userRequestId: Joi.custom(_customValidate.objectId).required()
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }

  return value
}
