import { platformDb } from '../../databases/mongo.db'
import path from 'path'
import createConnect from '..'

const schemasDir = path.join(__dirname, '../schemas')

const main = async () => {
  try {
    const store = createConnect(platformDb, schemasDir)
    const UserModel = store.getModel('User')
    console.log({ UserModel: await UserModel.find() })
  } catch (error) {
    console.error(error)
  }
}

void main()
