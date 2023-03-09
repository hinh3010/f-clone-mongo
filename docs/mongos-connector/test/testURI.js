const uri = require('../dist/helpers/mongodb')

console.log(uri.buildURI({
    hostPort: 'mongodb://base:3s1cPQ206eqhQPmx@staging-mogodb-1.c.platform126.internal,staging-mogodb-2.c.platform126.internal,staging-mogodb-arbiters.c.platform126.internal:27017',
    username: 'base',
    password: 'base_pass'
}, {replicaSet: 'rs0', authSource: 'bas__'}))