import { type IContext } from '@hellocacbantre/context'
import { type IPost } from '@hellocacbantre/db-schemas'
import createError from 'http-errors'
import { getStoreDb } from '../../connections/mongo.db'
import {
  validateBeforeCreatePost,
  validateBeforeUpdatePost,
  validateWhenDeletePost,
  validateWhenSearchPost
} from './validations'

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

  searchPosts = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { userRequestId, perPage, page } = validateWhenSearchPost(payload)

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

  searchPostsByUserId = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { perPage, page, userTargetId } = validateWhenSearchPost(payload)

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

  searchNewsFeed = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { perPage, page } = validateWhenSearchPost(payload)

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

  searchPostById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Post = getModel<IPost>('Post')
    const { postId } = validateWhenSearchPost(payload)

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

    if (!post) throw createError.NotFound('Post not found')

    return post
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
