import { type IContext } from '@hellocacbantre/context'
import { PAGE_ADMIN_ROLE, type IPage } from '@hellocacbantre/db-schemas'
import createError from 'http-errors'
import { getStoreDb } from '../../connections/mongo.db'
import { fetchPage, fetchPages } from './service'
import { validateBeforeCreatePage, validateBeforeUpdatePage, validateWhenDeletePage, validateWhenSearchPage, validateWhenSearchPages } from './validations'

export class PagesAction {
  private readonly context: IContext

  constructor(context: IContext) {
    this.context = context
  }

  createPage = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Page = getModel<IPage>('Page')
    const vPayload = validateBeforeCreatePage(payload)

    const adminPage: any = {
      userId: vPayload.createdById,
      role: PAGE_ADMIN_ROLE.Admin
    }

    vPayload.admins = [adminPage]

    const newPage = await Page.create(vPayload)
    return newPage
  }

  searchPages = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Page = getModel<IPage>('Page')

    const { limit, page, name, userRequestId } = validateWhenSearchPages(payload)

    const query: any = {
      deletedById: { $exists: false },
      $or: [{ visibility: 'public' }, { 'admins.userId': userRequestId }]
    }

    if (name) query.name = { $regex: /^J/, $options: 'i' }

    const totalDocs = await Page.countDocuments(query)
    const skip = limit * (page - 1)
    const totalPages = Math.ceil(totalDocs / limit)

    const groups = await fetchPages(this.context)(query, { skip, limit })

    return { docs: groups, totalDocs, limit, page, totalPages }
  }

  searchPageById = async (payload: any) => {
    const { pageId, userRequestId } = validateWhenSearchPage(payload)

    const query = {
      deletedById: { $exists: false },
      $or: [{ visibility: 'public' }, { 'admins.userId': userRequestId }],
      _id: pageId
    }

    const group = await fetchPage(this.context)(query)

    if (!group) throw createError.NotFound('Page not found')

    return group
  }

  updatePageById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Page = getModel<IPage>('Page')
    const { pageId, userRequestId, ...newData } = validateBeforeUpdatePage(payload)

    const query = {
      deletedById: { $exists: false },
      'admins.userId': userRequestId,
      _id: pageId
    }

    const post = await Page.findOneAndUpdate(query, newData, { new: true }).lean()
    if (!post) throw createError.NotFound('Page not found')

    return post
  }

  deletePageById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Page = getModel<IPage>('Page')
    const { pageId, userRequestId } = validateWhenDeletePage(payload)

    const query = {
      deletedById: { $exists: false },
      'admins.userId': userRequestId,
      _id: pageId
    }

    const group = await Page.findOne(query)

    if (!group) throw createError.NotFound('Page not found')

    await Page.updateOne(
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
