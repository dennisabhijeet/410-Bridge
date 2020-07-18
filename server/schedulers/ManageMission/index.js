const { CronJob } = require('cron')
require('../../services/managemission')
const { getTrips } = require('./trips.schedule')

// getTrips()

var job = new CronJob(
  '*/5 * * * *',
  async function () {
    this.stop()
    await getTrips().finally(() => {
      this.start()
    })
  },
  null
  // true
)

// job.start()
