import {Model, Document, Connection} from "mongoose"


interface StoreDB {
    getModel(modelName: string): Model<Document>

    getConnection(): Connection
}

export {StoreDB}

