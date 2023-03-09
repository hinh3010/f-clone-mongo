const {Client} = require('pg')

const client = new Client({
    user: 'postgres',
    password: '88888888',
    host: process.env.PG_HOST || 'ec2-3-138-155-97.us-east-2.compute.amazonaws.com',
    port: 5432,
    database: 'mongodb'
})

client.on('connect', () => {
    console.error('PG connect')
})

client.on('error', (err) => {
    console.error('PG error')
    process.exit(1)
})

client.on('end', () => {
    console.error('PG end')
    process.exit(1)
})

module.exports = client
