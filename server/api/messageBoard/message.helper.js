var { Message } = require('./message.model')
var { Partner } = require('../partners/partner.model')
var _ = require('lodash')

/**
 * tripId
 * text
 * url?
 * type? {image, video}
 */

exports.createMessage = async (messageData) => {
  let message = await Message.create(messageData)
  return message
}

exports.updateMessage = async (where = {}, messageNewData) => {
  await Message.update(messageNewData, { where })
  return messageNewData
}

exports.deleteMessage = async (where = {}) => {
  await Message.destroy({ where })

  return { _id: where._id, removed: true }
}

exports.findMessages = async (where = {}) => {
  const messages = await Message.findAll({
    where,
    include: [{ model: Partner, attributes: ['name', '_id'] }],
    order: [['_id', 'DESC']],
  })
  return messages
}

exports.findMessage = async (where = {}) => {
  const message = await Message.findOne({
    where,
    include: [{ model: Partner, attributes: ['name', '_id'] }],
  })
  return message ? message : {}
}
