// import { CronJob } from 'cron'
// const job = new CronJob('* * * * * *', () => {
//   console.log('Scheduled job is executed')
// })
// job.start()

import { CronJob } from 'cron'

class CronJobWrapper {
  private readonly jobs: Array<() => void>
  private readonly cronJob: CronJob

  constructor() {
    this.jobs = []
    this.cronJob = new CronJob('* * * * * *', () => {
      this.run()
    })
  }

  public addJob(job: () => void) {
    this.jobs.push(job)
  }

  public run() {
    this.jobs.forEach((job) => job())
  }

  public start() {
    this.cronJob.start()
  }

  public stop() {
    this.cronJob.stop()
  }
}

const cron = new CronJobWrapper()

cron.addJob(() => {
  console.log('Scheduled job is executed')
})

cron.addJob(() => {
  console.log('Scheduled job is executed')
})

cron.start()

// ts-node-esm src/schedulers/test/testCron.ts
