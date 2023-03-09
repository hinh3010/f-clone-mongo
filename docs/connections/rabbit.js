const {createRabbitMQConnection} = require('@pf126/rabbit')

const rabbit = createRabbitMQConnection({
    uri: process.env.RABBITMQ_URI || 'amqp://guest:QAVMGswCgaWoQoT4HEybYfV@rabbitmq-ha:5672'
})

module.exports = rabbit
