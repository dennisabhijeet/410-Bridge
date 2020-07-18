// var { User } = require('../user/user.model')
// var getAWSSignedURL = require('./files.helpers').getAWSSignedURL
// var confiemFileUpload = require('./files.helpers').confiemFileUpload
// var saveURL = require('./files.helpers').saveURL
// var logger = require('../../util/logger')
const { v4: uuidv4 } = require('uuid')
const { getDownloadURL, getUploadURL } = require('../../services/s3')

exports.getUploadUrl = async function (req, res, next) {
  const { type, typeExt, category } = req.body
  const key = `${category}/${uuidv4()}.${typeExt}`

  var { url } = await getUploadURL(key, type)
  res.json({ url, key })
}
exports.redirectToDownloadUrl = async function (req, res, next) {
  const { category, fileKey } = req.params
  const key = `${category}/${fileKey}`
  const expires = 15

  var { url } = await getDownloadURL(key, expires)
  res.redirect(url)
}
