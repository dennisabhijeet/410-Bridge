var _ = require('lodash')
var dotenv = require('dotenv').config()

var config = {
  domain: process.env.DOMAIN,
  dev: 'development',
  test: 'testing',
  prod: 'production',
  stage: 'staging',
  port: process.env.port || 8080,
  // url: process.env.URL || 'http://localhost:8080/',
  expireTime: {
    small: 24 * 60 * 60 * 1, // 1 days in seconds
    large: 24 * 60 * 60 * 10, // 10 days in seconds
  },
  storage: {
    s3: {
      bucket: process.env.S3_STORAGE_BUCKET || 'bucket-for-uploads',
    },
  },
  secrets: {
    jwt: process.env.JWT || 'gumball',
    manageMission: process.env.MANAGE_MISSION,
    s3: {
      accessKey: process.env.S3_ACCESS_KEY_ID,
      secrect: process.env.S3_SECRET,
    },
  },
  smtp: {
    host: process.env.MAIL_HOST || '',
    port: process.env.MAIL_PORT || '',
    username: process.env.MAIL_USERNAME || '',
    password: process.env.MAIL_PASSWORD || '',
  },
}

process.env.NODE_ENV = process.env.NODE_ENV || config.dev
config.env = process.env.NODE_ENV
if (config.env === 'test') config.env = config.test

var envConfig
// require could error out if
// the file don't exist so lets try this statement
// and fallback to an empty object if it does error out
try {
  envConfig = require('./' + config.env)
  // just making sure the require actually
  // got something back :)
  envConfig = envConfig || {}
} catch (e) {
  envConfig = {}
}

// merge the two config files together
// the envConfig file will overwrite properties
// on the config object
module.exports = _.merge(config, envConfig)
