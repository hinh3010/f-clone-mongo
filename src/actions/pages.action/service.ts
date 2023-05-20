import { type IContext } from '@hellocacbantre/context'
import { type IPage, type IUser } from '@hellocacbantre/db-schemas'
import { getStoreDb } from '../../connections/mongo.db'

export const fetchPages = (context: IContext) => {
  const { getModel } = getStoreDb(context)
  const Page = getModel<IPage>('Page')
  const User = getModel<IUser>('User')

  return async (query: any, params: any) => {
    const { skip, limit } = params
    const posts = await Page.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate({
        path: 'admins.userId',
        select: 'email firstName lastName gender avatarUrl coverImageUrl dateOfBirth phoneNumber',
        model: User,
        match: { deletedAt: { $exists: false } },
        options: { lean: true }
      })
    return posts
  }
}

export const fetchPage = (context: IContext) => {
  const { getModel } = getStoreDb(context)
  const Page = getModel<IPage>('Page')
  const User = getModel<IUser>('User')

  return async (query: any) => {
    const posts = await Page.findOne(query)
      .sort({ createdAt: -1 })
      .lean()
      .populate({
        path: 'admins.userId',
        select: 'firstName lastName reverseName email gender',
        model: User,
        match: { deletedAt: { $exists: false } },
        options: { lean: true }
      })
    return posts
  }
}
