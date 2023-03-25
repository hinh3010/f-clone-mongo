import { scheduleJob, type JobCallback } from 'node-schedule'

const job: JobCallback = () => {
  console.log('Job running!')
}

scheduleJob('*/1 * * * *', job)
