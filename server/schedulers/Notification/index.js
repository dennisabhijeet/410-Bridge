const { CronJob } = require('cron')
const moment = require('moment')

const {
  getAnnouncementsInRange,
  getFomatedAnnouncementsAndUser,
  sendNotification,
  updateAnnouncementsInRange,
} = require('./notificationHelper')

const cronFunction = async function () {
  try {
    const timeNow = moment().set({ hour: 0, minute: 0, second: 0 })
    const timeTomorrow = moment().set({ hour: 23, minute: 59, second: 59 })
    const announcements = await getAnnouncementsInRange(timeNow, timeTomorrow)
    console.log(announcements)
    const formatedAnnouncementsandUsers = await getFomatedAnnouncementsAndUser(
      announcements
    )
    await sendNotification(formatedAnnouncementsandUsers)
    await updateAnnouncementsInRange(announcements)
  } catch (err) {
    console.error(err)
  }
}
var job = new CronJob(
  '0 7,12,18 * * *',
  cronFunction,
  null
  // true
)

job.start()
