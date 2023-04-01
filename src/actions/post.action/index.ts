import { type IPost, FILE_TYPE, POST_TYPE, POST_VISIBLE_TYPE } from '@hellocacbantre/db-schemas'
import Joi from 'joi'
import { isValidObjectId, type ObjectId } from 'mongoose'
import { getModel } from '../../models'

const customValidations = {
  objectId: (value: string, helpers: any) => {
    if (!isValidObjectId(value)) {
      return helpers.message('"{{#label}}" must be a valid id')
    }
    return value as unknown as ObjectId
  }
}

const attachmentSchema = Joi.object({
  fileUrl: Joi.string().optional(),
  fileType: Joi.string()
    .valid(...Object.values(FILE_TYPE))
    .optional(),
  thumbnail: Joi.string().optional()
}).optional()

const locationSchema = Joi.object({
  country: Joi.custom(customValidations.objectId).optional(),
  province: Joi.custom(customValidations.objectId).optional(),
  district: Joi.custom(customValidations.objectId).optional(),
  ward: Joi.custom(customValidations.objectId).optional(),
  street: Joi.custom(customValidations.objectId).optional(),
  other: Joi.string().optional()
}).optional()

const shareSchema = Joi.object({
  postId: Joi.custom(customValidations.objectId).required(),
  sharedAt: Joi.date().required()
}).optional()

const _validateBeforeCreatePost = (payload: IPost) => {
  const schema = Joi.object<IPost>({
    content: Joi.string().optional(),

    attachments: Joi.array()
      .items(attachmentSchema)
      .custom((value, helpers: any) => {
        if (!value?.length) {
          return helpers.message('"attachments" must not be an empty array')
        }
        return value
      }),
    backgroundId: Joi.custom(customValidations.objectId).optional(),

    visibility: Joi.string()
      .valid(...Object.values(POST_VISIBLE_TYPE))
      .optional(),

    type: Joi.string()
      .valid(...Object.values(POST_TYPE))
      .optional(),

    tags: Joi.array().items(Joi.custom(customValidations.objectId)).optional(),

    hashTags: Joi.array().items(Joi.string()).optional(),

    location: locationSchema.custom((value, helpers: any) => {
      if (!Object.keys(value).length) {
        return helpers.message('"location" must not be an empty object')
      }
      return value
    }),

    shares: shareSchema,

    eventId: Joi.custom(customValidations.objectId).optional(),
    pollId: Joi.custom(customValidations.objectId).optional(),

    createdById: Joi.custom(customValidations.objectId).required()
  }).or('content', 'attachments', 'location', 'eventId', 'pollId', 'shares')

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}

const _validateWhenSearchPost = (payload: any) => {
  const schema = Joi.object({
    userTargetId: Joi.custom(customValidations.objectId).optional(),
    postId: Joi.custom(customValidations.objectId).optional(),
    userRequestId: Joi.custom(customValidations.objectId).required(),
    page: Joi.number().default(1).min(1),
    perPage: Joi.number().default(10).min(1)
  })

  const { error, value } = schema.validate(payload)

  if (error) {
    throw new Error(error.message ?? error)
  }
  return value
}
export class PostAction {
  createPost(headers?: any) {
    const Post = getModel<IPost>('Post')
    return async (payload: IPost) => {
      const vPayload = _validateBeforeCreatePost(payload)
      const newPost = await Post.create(vPayload)
      return newPost
    }
  }

  searchPosts(headers?: any) {
    const Post = getModel<IPost>('Post')
    return async (payload: any) => {
      const { userRequestId, perPage, page } = _validateWhenSearchPost(payload)

      const query = {
        deletedAt: { $exists: false },
        createdById: userRequestId
      }

      const totalPosts = await Post.countDocuments(query)
      const skip = perPage * (page - 1)
      const totalPages = Math.ceil(totalPosts / perPage)

      const posts = await Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(perPage).lean()

      return { docs: posts, totalDocs: totalPosts, perPage, page, totalPages }
    }
  }

  searchPostsByUserId(headers?: any) {
    const Post = getModel<IPost>('Post')
    return async (payload: any) => {
      const { perPage, page, userTargetId } = _validateWhenSearchPost(payload)

      const query = {
        deletedAt: { $exists: false },
        createdById: userTargetId,
        visibility: 'public'
      }

      const totalPosts = await Post.countDocuments(query)
      const skip = perPage * (page - 1)
      const totalPages = Math.ceil(totalPosts / perPage)

      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate({
          path: 'createdById',
          select: 'email firstName lastName gender avatarUrl coverImageUrl dateOfBirth phoneNumber',
          match: { deletedAt: { $exists: false } }
        })

      return { docs: posts, totalDocs: totalPosts, perPage, page, totalPages }
    }
  }

  searchNewsFeed(headers?: any) {
    const Post = getModel<IPost>('Post')
    return async (payload: any) => {
      const { perPage, page } = _validateWhenSearchPost(payload)

      const query = {
        deletedAt: { $exists: false },
        visibility: 'public'
      }

      const totalPosts = await Post.countDocuments(query)
      const skip = perPage * (page - 1)
      const totalPages = Math.ceil(totalPosts / perPage)

      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate({
          path: 'createdById',
          select: 'email firstName lastName gender avatarUrl coverImageUrl dateOfBirth phoneNumber',
          match: { deletedAt: { $exists: false } }
        })

      return { docs: posts, totalDocs: totalPosts, perPage, page, totalPages }
    }
  }

  searchPostById(headers?: any) {
    const Post = getModel<IPost>('Post')
    return async (payload: any) => {
      const { postId } = _validateWhenSearchPost(payload)

      const query = {
        deletedAt: { $exists: false },
        visibility: 'public',
        _id: postId
      }

      const post = await Post.findOne(query).populate({
        path: 'createdById',
        select: 'email firstName lastName gender avatarUrl coverImageUrl dateOfBirth phoneNumber',
        match: { deletedAt: { $exists: false } }
      })

      if (!post) throw new Error(`Could not find post ${postId}`)

      return post
    }
  }

  updatePostById(headers?: any) {
    const Post = getModel<IPost>('Post')
    return async (payload: any) => {
      const { postId, userRequestId } = _validateWhenSearchPost(payload)

      const query = {
        deletedAt: { $exists: false },
        createdById: userRequestId,
        _id: postId
      }

      const newData = {
        content: 'hello cac ban tre',
        visibility: 'public',
        type: 'normal',
        location: {
          other: 'Ha noi 2'
        },
        attachments: [
          {
            fileUrl: 'https://bom.so/e79j97',
            fileType: 'image'
          }
        ]
      }

      const post = await Post.findOneAndUpdate(query, newData, { new: true }).lean()
      if (!post) throw new Error(`Could not find post ${postId}`)

      return post
    }
  }

  deletePostById(headers?: any) {
    const Post = getModel<IPost>('Post')
    return async (payload: any) => {
      const { postId, userRequestId } = _validateWhenSearchPost(payload)

      const query = {
        deletedById: { $exists: false },
        createdById: userRequestId,
        _id: postId
      }

      const post = await Post.findOne(query)

      if (!post) throw new Error(`Could not find post ${postId}`)

      await Post.updateOne(
        query,
        {
          deletedAt: Date.now(),
          deletedById: userRequestId
        },
        { new: true }
      ).lean()

      return post
    }
  }
}
