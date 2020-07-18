const AWS = require('aws-sdk')
const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.secrets.s3.accessKey,
  secretAccessKey: config.secrets.s3.secrect,
})

exports.getUploadURL = (key, type) => {
  return new Promise((res, rej) => {
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: config.storage.s3.bucket,
        ContentType: type,
        Key: key,
      },
      (err, url) => {
        if (err) {
          rej(err)
        }
        res({ url, key })
      }
    )
  })
}
exports.getDownloadURL = (key, expires) => {
  return new Promise((res, rej) => {
    s3.getSignedUrl(
      'getObject',
      {
        Bucket: config.storage.s3.bucket,
        Key: key,
        Expires: expires,
      },
      (err, url) => {
        if (err) {
          rej(err)
        }
        res({ url, key })
      }
    )
  })
}
