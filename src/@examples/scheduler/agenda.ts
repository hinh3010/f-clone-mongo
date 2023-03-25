// import { Agenda } from 'agenda'

// /**
//  * Creates a new Agenda instance with MongoDB as the storage layer.
//  * @constructor
//  * @param {Object} [options] - An object containing options for the Agenda instance.
//  * @param {Object} [options.db] - The MongoDB connection options.
//  * @param {string} [options.db.address] - The address of the MongoDB instance.
//  */
// const agenda = new Agenda({ db: { address: 'mongodb://localhost/agenda' } })

// /**
//  * Defines a job with the given name and options.
//  * @function
//  * @param {string} name - The name of the job.
//  * @param {Object} options - The options for the job.
//  * @param {function} fn - The function to be called when the job is run.
//  */
// agenda.define(
//   'send email',
//   async (job: { attrs: { data: { to: string } } }) => {
//     console.log('Send email to' + job.attrs.data.to)
//   }
// )

// /**
//  * Sets up a handler for the "ready" event, which is emitted when Agenda is ready to start processing jobs.
//  * @function
//  */
// agenda.on('ready', function () {
//   void agenda.every('30 minutes', 'send email', { to: 'john@example.com' })
//   void agenda.every('*/30 * * * *', 'send email')
// })

// /**
//  * Starts the job processor and begins processing jobs.
//  * @function
//  * @returns {Promise} - A Promise that resolves when Agenda has started processing jobs.
//  */
// void agenda.start()

// import { Agenda } from 'agenda'

// const agenda = new Agenda({ db: { address: 'mongodb://localhost/agenda' } })

// async function startAgenda() {
//   await agenda.start()
//   console.log('Agenda scheduler started successfully!')
// }

// async function scheduleJob() {
//   agenda.define('myJob', async (job: { attrs: { name: any } }) => {
//     console.log(`Running job: ${job.attrs.name}`)
//   })

//   await agenda.every('10 seconds', 'myJob', { name: 'My Test Job' })
//   console.log('Job scheduled successfully!')
// }

// startAgenda()
//   .then(async () => scheduleJob())
//   .catch((err) => console.error(`Error starting agenda: ${err}`))

// import Agenda, { type Job, JobPriority } from 'agenda'
// import Redis from 'ioredis'

// const connectionOpts = {
//   db: { address: 'mongodb://localhost/agenda' },
//   redis: new Redis({ host: 'localhost', port: 6379 })
// }

// const agenda = new Agenda(connectionOpts)

// interface JobData {
//   text: string
// }

// async function defineJobs() {
//   agenda.define(
//     'send email',
//     {
//       priority: JobPriority.high,
//       concurrency: 10,
//       lockLimit: 3,
//       lockLifetime: 1000,
//       shouldSaveResult: true
//     },
//     (job: Job<JobData>, done) => {
//       console.log(`Sending email with text: ${job.attrs.data.text}`)
//       done()
//     }
//   )

//   agenda.define(
//     'delete old users',
//     { priority: JobPriority.low },
//     (job: Job) => {
//       console.log('Deleting old users...')
//     }
//   )

//   agenda.define(
//     'hello',
//     { priority: JobPriority.low },
//     async (job, done: any) => {
//       console.log('running my job')
//       done()
//     }
//   )

//   //   agenda.mongo.db
//   //     .collection('agendaJobs')
//   //     .find({ lockedAt: null, nextRunAt: { $lte: new Date() } })
//   //     .toArray()
// }

// async function scheduleJobs() {
//   const tomorrow = new Date()
//   tomorrow.setDate(tomorrow.getDate() + 1)

//   await agenda.schedule(tomorrow, 'send email', { text: 'Hello world!' })
//   await agenda.every('30 minutes', 'delete old users')
// }

// async function startAgenda() {
//   await agenda.start()
//   console.log('Agenda scheduler started successfully!')
// }

// startAgenda()
//   .then(async () => await agenda.now('hello', { data: 'hello cac ban tre' }))
//   .then(async () => defineJobs())
//   .then(async () => scheduleJobs())
//   .catch((err) => console.error(`Error starting agenda: ${err}`))

import Agenda from 'agenda'
import Redis from 'ioredis'

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
  password: ''
})

const agenda = new Agenda({
  db: { address: 'redis://localhost:6379/agenda' },
  processEvery: '1 minute'
})

// Định nghĩa công việc
agenda.define(
  'send email',
  async (job: { attrs: { data: { to: any; subject: any; body: any } } }) => {
    const { to, subject, body } = job.attrs.data
    console.log({ to, subject, body })
    // Gửi email tới người nhận
  }
)

// Lên lịch công việc
const emailJob = agenda.create('send email', {
  to: 'example@email.com',
  subject: 'Test email',
  body: 'This is a test email'
})

emailJob.repeatEvery('1 hour')
void emailJob.save()

// Kết nối đến Redis và bắt đầu quá trình xử lý công việc
agenda.on('ready', () => {
  void agenda.start()
})
