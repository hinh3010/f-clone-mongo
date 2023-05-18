import { type IContext } from '@hellocacbantre/context'
import {
  type IUser,
  type IPost,
  type IBackgroundPost,
  POST_ENTITY_TYPE
} from '@hellocacbantre/db-schemas'
import createError from 'http-errors'
import { getStoreDb } from '../../connections/mongo.db'
import {
  validateBeforeCreatePost,
  validateBeforeUpdatePost,
  validateWhenDeletePost,
  validateWhenSearchPost
} from './validations'

const fetchPosts = (context: IContext) => {
  const { getModel } = getStoreDb(context)
  const Post = getModel<IPost>('Post')
  const User = getModel<IUser>('User')
  const BackgroundPost = getModel<IBackgroundPost>('BackgroundPost')

  return async (query: any, params: any) => {
    const { skip, limit } = params
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate({
        path: 'createdById',
        select: 'email firstName lastName gender avatarUrl coverImageUrl dateOfBirth phoneNumber',
        model: User,
        match: { deletedAt: { $exists: false } }
      })
      .populate({
        path: 'backgroundId',
        model: BackgroundPost,
        match: { deletedAt: { $exists: false } }
      })
    return posts
  }
}

const fetchPost = (context: IContext) => {
  const { getModel } = getStoreDb(context)
  const Post = getModel<IPost>('Post')
  const User = getModel<IUser>('User')
  const BackgroundPost = getModel<IBackgroundPost>('BackgroundPost')

  return async (query: any) => {
    const posts = await Post.findOne(query)
      .sort({ createdAt: -1 })
      .lean()
      .populate({
        path: 'createdById',
        select: 'firstName lastName reverseName email gender',
        model: User
      })
      .populate({
        path: 'backgroundId',
        model: BackgroundPost
      })
    return posts
  }
}

export class PostAction {
  private readonly context: IContext

  constructor(context: IContext) {
    this.context = context
  }

  createPost = async (payload: IPost) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const vPayload = validateBeforeCreatePost(payload)
    const newPost = await Post.create(vPayload)
    return newPost
  }

  searchNewsFeed = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { limit, page, pageTargetId, groupTargetId, userTargetId } =
      validateWhenSearchPost(payload)

    const query = {
      deletedAt: { $exists: false },
      visibility: 'public'
    } as any

    if (pageTargetId) {
      query.entityType = POST_ENTITY_TYPE.Page
      query.entityId = pageTargetId
    } else if (groupTargetId) {
      query.entityType = POST_ENTITY_TYPE.Group
      query.entityId = groupTargetId
    }

    if (userTargetId) query.createdById = userTargetId

    const totalPosts = await Post.countDocuments(query)
    const skip = limit * (page - 1)
    const totalPages = Math.ceil(totalPosts / limit)

    const posts = await fetchPosts(this.context)(query, { skip, limit })

    return { docs: posts, totalDocs: totalPosts, limit, page, totalPages }
  }

  searchPostsByUserId = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { limit, page, userTargetId } = validateWhenSearchPost(payload)

    const query = {
      deletedAt: { $exists: false },
      createdById: userTargetId,
      visibility: 'public'
    }

    const totalPosts = await Post.countDocuments(query)
    const skip = limit * (page - 1)
    const totalPages = Math.ceil(totalPosts / limit)

    const posts = await fetchPosts(this.context)(query, { skip, limit })

    return { docs: posts, totalDocs: totalPosts, limit, page, totalPages }
  }

  searchPostById = async (payload: any) => {
    const { postId } = validateWhenSearchPost(payload)

    const query = {
      deletedAt: { $exists: false },
      visibility: 'public',
      _id: postId
    }

    const post = await fetchPost(this.context)(query)

    if (!post) throw createError.NotFound('Post not found')

    return post
  }

  searchPosts = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')

    const { limit, page } = validateWhenSearchPost(payload)

    const query = {
      deletedAt: { $exists: false },
      visibility: 'public'
    }

    const totalPosts = await Post.countDocuments(query)
    const skip = limit * (page - 1)
    const totalPages = Math.ceil(totalPosts / limit)

    const posts = await fetchPosts(this.context)(query, { skip, limit })

    return { docs: posts, totalDocs: totalPosts, limit, page, totalPages }
  }

  updatePostById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { postId, userRequestId, ...newData } = validateBeforeUpdatePost(payload)

    const query = {
      deletedAt: { $exists: false },
      createdById: userRequestId,
      _id: postId
    }

    const post = await Post.findOneAndUpdate(query, newData, { new: true }).lean()
    if (!post) throw createError.NotFound('Post not found')

    return post
  }

  deletePostById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { postId, userRequestId } = validateWhenDeletePost(payload)

    const query = {
      deletedById: { $exists: false },
      createdById: userRequestId,
      _id: postId
    }

    const post = await Post.findOne(query)

    if (!post) throw createError.NotFound('Post not found')

    await Post.updateOne(
      query,
      {
        deletedAt: Date.now(),
        deletedById: userRequestId
      },
      { new: true }
    ).lean()

    return true
  }
}
