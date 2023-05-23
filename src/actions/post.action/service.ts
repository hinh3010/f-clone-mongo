import { type IContext } from '@hellocacbantre/context'
import { type IBackgroundPost, type IPost, type IUser } from '@hellocacbantre/db-schemas'
import { getStoreDb } from '../../connections/mongo.db'

export const fetchPosts = (context: IContext) => {
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

export const fetchPost = (context: IContext) => {
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
