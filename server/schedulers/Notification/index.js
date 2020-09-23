const {
  CronJob
} = require('cron')
const moment = require('moment')
const AWS = require('aws-sdk')
const logger = require('../../util/logger')
const {
  getAnnouncementsInRange,
  getFomatedAnnouncementsAndUser,
  sendNotification,
  updateAnnouncementsInRange,
} = require('./notificationHelper')

const cronFunction = async function () {
  try {
    const timeNow = moment().set({
      hour: 0,
      minute: 0,
      second: 0
    })
    const timeTomorrow = moment().set({
      hour: 23,
      minute: 59,
      second: 59
    })
    const announcements = await getAnnouncementsInRange(timeNow, timeTomorrow)
    const formatedAnnouncementsandUsers = await getFomatedAnnouncementsAndUser(
      announcements
    )
    await sendNotification(formatedAnnouncementsandUsers)
    await updateAnnouncementsInRange(announcements)
  } catch (err) {
    console.error(err)
  }
}

AWS.config.update({
  region: 'us-east-1'
}) // change to your region
var opts = {
  credentials: new AWS.EC2MetadataCredentials(), // default to use the credentials for the ec2 instance
}

var elasticbeanstalk = new AWS.ElasticBeanstalk(opts)
var ec2 = new AWS.EC2(opts)
var metadata = new AWS.MetadataService(opts)

function runTaskOnMaster(taskToRun) {
  return new Promise((resolve, reject) => {
      metadata.request('/latest/meta-data/instance-id', (err, InstanceId) => {
        if (err) {
          return reject(err)
        }
        return resolve(InstanceId)
      })
    })
    .then((currentInstanceId) => {
      logger.log('InstanceId', currentInstanceId)
      return new Promise((resolve, reject) => {
        var params = {
          Filters: [{
            Name: 'resource-id',
            Values: [currentInstanceId],
          }, ],
        }

        ec2.describeTags(params, (err, data) => {
          if (err) {
            return reject('dt' + err)
          }

          var envIdTag = data.Tags.find(
            (t) => t.Key === 'elasticbeanstalk:environment-id'
          )
          if (envIdTag === null) {
            return reject(
              'Failed to find the value of "elasticbeanstalk:environment-id" tag.'
            )
          }

          elasticbeanstalk.describeEnvironmentResources({
              EnvironmentId: envIdTag.Value
            },
            function (err, data) {
              if (err) {
                return reject('de' + err)
              }
              if (
                currentInstanceId !== data.EnvironmentResources.Instances[0].Id
              ) {
                return resolve(false)
              }
              return resolve(true)
            }
          )
        })
      })
    })
    .then((isMaster) => {
      if (!isMaster) {
        logger.log('Not running task as not master EB instance.');
      } else {
        logger.log('Identified as master EB instance. Running task.');
        taskToRun()
      }
    })
    .catch((err) => logger.error(err))
}

var job = new CronJob(
  '30 12,17,23 * * *',
  runTaskOnMaster(cronFunction),
  null
  // true
)
job.start()