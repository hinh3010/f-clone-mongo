import { type IContext } from '@hellocacbantre/context'
import { LIKE_ENTITY_TYPE, type ILike, type IPost } from '@hellocacbantre/db-schemas'
import createError from 'http-errors'
import { getStoreDb } from '../../connections/mongo.db'
import { validateBeforeLike } from './validations'

export class LikeAction {
  like(context: IContext) {
    const { getModel } = getStoreDb(context)
    const Like = getModel<ILike>('Comment')

    return async (payload: ILike) => {
      const vPayload = validateBeforeLike(payload)
      const { entityId, entityType, createdById, reactType } = vPayload

      if (entityType === LIKE_ENTITY_TYPE.Post) {
        const Post = getModel<IPost>('Post')

        const query = {
          deletedAt: { $exists: false },
          visibility: 'public',
          _id: entityId
        }

        const post = await Post.findOne(query)
        if (!post) throw createError.NotFound('Post not found')

        // const liked: ILike = await Like.find({
        //   entityId,
        //   createdById,
        //   entityType
        // }).lean()

        // if (liked && liked.reactType !== reactType) {
        //   liked.reactType = reactType
        //   liked.save()
        //   return true
        // }

        // if (liked && liked.reactType === reactType) {
        //   return true
        // }

        // await Like.create(vPayload)
        // return true

        const liked = await Like.findOneAndUpdate(
          // Find the existing "like" document and update the "reactType" property if necessary
          { entityId, createdById, entityType },
          { reactType },
          { upsert: true, new: true }
        )

        return !!liked
      }

      return entityType
    }
  }

  dislike(context: IContext) {
    const { getModel } = getStoreDb(context)
    const Like = getModel<ILike>('Comment')

    return async (payload: ILike) => {
      const vPayload = validateBeforeLike(payload)
      const { entityId, entityType, createdById } = vPayload

      await Like.deleteOne({
        entityId,
        createdById,
        entityType
      }).lean()

      return true
    }
  }
}
