import { type IContext } from '@hellocacbantre/context'
import { type IGroup } from '@hellocacbantre/db-schemas'
import { GROUP_ADMIN_ROLE } from '@hellocacbantre/db-schemas/dist/enums/group.enum'
import createError from 'http-errors'
import { getStoreDb } from '../../connections/mongo.db'
import { fetchGroup, fetchGroups } from './service'
import { TYPE_SEARCH, validateBeforeCreateGroup, validateBeforeUpdateGroup, validateWhenDeleteGroup, validateWhenSearchGroup, validateWhenSearchGroups } from './validations'

export class GroupsAction {
  private readonly context: IContext

  constructor(context: IContext) {
    this.context = context
  }

  createGroup = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Group = getModel<IGroup>('Group')
    const { email, phone, ...data } = validateBeforeCreateGroup(payload)

    const adminGroup: any = {
      userId: data.createdById,
      role: GROUP_ADMIN_ROLE.Admin
    }

    if (email) adminGroup.email = email
    if (phone) adminGroup.phone = phone

    data.admins = [adminGroup]

    const newGroup = await Group.create(data)
    return newGroup
  }

  searchGroups = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Group = getModel<IGroup>('Group')

    const { limit, page, name, userRequestId, typeSearch } = validateWhenSearchGroups(payload)

    const query: any = {
      deletedById: { $exists: false }
    }

    if (typeSearch === TYPE_SEARCH.MY_GROUPS) query['admins.userId'] = userRequestId
    else if (typeSearch === TYPE_SEARCH.GROUPS_JOINED) {
      query['admins.userId'] = userRequestId // { $ne: userRequestId }
    } else if (typeSearch === TYPE_SEARCH.OTHER_GROUPS) {
      query.visibility = 'public'
      query['admins.userId'] = { $ne: userRequestId }
    }
    if (name) query.name = { $regex: /^J/, $options: 'i' }

    const totalGroups = await Group.countDocuments(query)
    const skip = limit * (page - 1)
    const totalPages = Math.ceil(totalGroups / limit)

    const groups = await fetchGroups(this.context)(query, { skip, limit })

    return { docs: groups, totalDocs: totalGroups, limit, page, totalPages }
  }

  searchGroupById = async (payload: any) => {
    const { groupId, userRequestId } = validateWhenSearchGroup(payload)

    const query = {
      deletedById: { $exists: false },
      $or: [{ visibility: 'public' }, { 'admins.userId': userRequestId }],
      _id: groupId
    }

    const group = await fetchGroup(this.context)(query)

    if (!group) throw createError.NotFound('Group not found')

    return group
  }

  updateGroupById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Group = getModel<IGroup>('Group')
    const { groupId, userRequestId, ...newData } = validateBeforeUpdateGroup(payload)

    const query = {
      deletedById: { $exists: false },
      'admins.userId': userRequestId,
      _id: groupId
    }

    const post = await Group.findOneAndUpdate(query, newData, { new: true }).lean()
    if (!post) throw createError.NotFound('Group not found')

    return post
  }

  deleteGroupById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Group = getModel<IGroup>('Group')
    const { groupId, userRequestId } = validateWhenDeleteGroup(payload)

    const query = {
      deletedById: { $exists: false },
      'admins.userId': userRequestId,
      _id: groupId
    }

    const group = await Group.findOne(query)

    if (!group) throw createError.NotFound('Group not found')

    await Group.updateOne(
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
