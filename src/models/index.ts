import { createConnect } from '@hellocacbantre/db-schemas'
import { platformDb } from '../databases/mongo.db'

export const { getModel, getConnection } = createConnect(platformDb)
