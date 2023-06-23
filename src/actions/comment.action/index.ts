import { type IContext } from '@hellocacbantre/context'
import { COMMENT_ENTITY_TYPE, type IComment, type IPost } from '@hellocacbantre/db-schemas'
import createError from 'http-errors'
import { getStoreDb } from '../../connections/mongo.db'
import { validateBeforeCreateComment, validateBeforeUpdateComment, validateWhenDeleteComment } from './validations'

export class CommentAction {
  private readonly context: IContext

  constructor(context: IContext) {
    this.context = context
  }

  createComment = async (payload: IComment) => {
    const { getModel } = getStoreDb(this.context)
    const Comment = getModel<IComment>('Comment')
    console.log('🚀 ~ file: index.ts:13 ~ CommentAction ~ return ~ payload:', payload)
    const vPayload = validateBeforeCreateComment(payload)
    console.log('🚀 ~ file: index.ts:18 ~ CommentAction ~ return ~ vPayload:', vPayload)
    // const { entityId, entityType, parentId } = vPayload

    // if (parentId) {
    //   const comment = await Comment.findById(parentId)
    //   if (!comment) throw createError.NotFound('Comment not found')
    // }

    // if (entityType === COMMENT_ENTITY_TYPE.Post) {
    //   const Post = getModel<IPost>('Post')
    //   const query = {
    //     deletedAt: { $exists: false },
    //     visibility: 'public',
    //     _id: entityId
    //   }

    //   const post = await Post.findOne(query)
    //   if (!post) throw createError.NotFound('Post not found')

    //   const newComment = await Comment.create(vPayload)
    //   return newComment
    // }

    // return entityType
  }

  updateCommentById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Comment = getModel<IComment>('Comment')
    const { commentId, userRequestId, ...newData } = validateBeforeUpdateComment(payload)

    const query = {
      deletedAt: { $exists: false },
      createdById: userRequestId,
      _id: commentId
    }

    const comment = await Comment.findOneAndUpdate(query, newData, { new: true }).lean()
    if (!comment) throw createError.NotFound('Comment not found')

    return comment
  }

  deleteCommentById = async (payload: any) => {
    const { getModel } = getStoreDb(this.context)
    const Comment = getModel<IComment>('Comment')
    const { commentId, userRequestId } = validateWhenDeleteComment(payload)

    const query = {
      deletedById: { $exists: false },
      createdById: userRequestId,
      _id: commentId
    }

    // const { deletedCount } = await Comment.deleteOne(query)
    // if (!deletedCount) throw createError.NotFound('Comment not found')

    const comment = await Comment.findOne(query)

    if (!comment) throw createError.NotFound('Comment not found')

    await Comment.updateOne(
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
