import { type IContext } from '@hellocacbantre/context'
import { getFalcol } from '../connections/redisio.db'

export const getGlobalSetting = (context: IContext) => {
  const falcol = getFalcol(context)
  return async (key: string): Promise<string> => {
    return (await falcol.get(`global_setting:${key}`)) ?? ''
  }
}
