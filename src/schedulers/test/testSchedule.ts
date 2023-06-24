// import schedule from 'node-schedule'

// schedule.scheduleJob('*/5 * * * * *', () => {
//   console.log('Scheduled job is executed')
// })

import schedule from 'node-schedule'

class JobScheduler {
  private jobs: schedule.Job[] = []

  public addJob(scheduleExpression: string, jobFunction: () => void): void {
    const job = schedule.scheduleJob(scheduleExpression, jobFunction)
    this.jobs.push(job)
  }

  public cancelAllJobs(): void {
    this.jobs.forEach((job) => job.cancel())
    this.jobs = []
  }
}

const jobScheduler = new JobScheduler()

jobScheduler.addJob('*/5 * * * * *', () => {
  console.log('Job 1 is executed')
})

jobScheduler.addJob('*/10 * * * * *', () => {
  console.log('Job 2 is executed')
})

// jobScheduler.cancelAllJobs()

// ts-node-esm src/schedulers/test/testSchedule.ts
