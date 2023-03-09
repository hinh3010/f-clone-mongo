declare type Options = {
    poolSize?: number,
    debug?: boolean,
    useCreateIndex?: boolean | true,
    useNewUrlParser?: boolean | true,
    useFindAndModify?: boolean | true,
    useUnifiedTopology?: boolean | true,
    namespace?: string,
    connectTimeout?: number | 30000,
    defaultWriteConcern?: boolean,
}

declare type ConnectionOptions = Options

export default ConnectionOptions
