import { type IContext } from '@hellocacbantre/context'
import { type IGroup, type IUser } from '@hellocacbantre/db-schemas'
import { getStoreDb } from '../../connections/mongo.db'

export const fetchGroups = (context: IContext) => {
  const { getModel } = getStoreDb(context)
  const Group = getModel<IGroup>('Group')
  const User = getModel<IUser>('User')

  return async (query: any, params: any) => {
    const { skip, limit } = params
    const posts = await Group.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate({
        path: 'admins.userId',
        select: 'email firstName lastName gender avatarUrl coverImageUrl dateOfBirth phoneNumber',
        model: User,
        match: { deletedAt: { $exists: false } }
      })
    return posts
  }
}

export const fetchGroup = (context: IContext) => {
  const { getModel } = getStoreDb(context)
  const Group = getModel<IGroup>('Group')
  const User = getModel<IUser>('User')

  return async (query: any) => {
    const posts = await Group.findOne(query)
      .sort({ createdAt: -1 })
      .lean()
      .populate({
        path: 'admins.userId',
        select: 'firstName lastName reverseName email gender',
        model: User,
        match: { deletedAt: { $exists: false } }
      })
    return posts
  }
}
