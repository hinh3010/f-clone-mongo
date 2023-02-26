import { Env } from '../../config'

const _formatKey = (key: string): string => {
  const serviceName = Env.SERVICE_NAME
  const nodeEnv = Env.NODE_ENV

  return (serviceName && nodeEnv)
    ? `${serviceName}_${nodeEnv}_${key}`
    : 'local_' + key
}

export default _formatKey
