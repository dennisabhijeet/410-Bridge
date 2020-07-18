var Packaging = require('./packaging.model')
var _ = require('lodash')

exports.createpackaging = async (packagingData) => {
  let packaging = await Packaging.create(packagingData)
  return packaging
}

exports.updatepackaging = async (where = {}, packagingNewData) => {
  const saved = await Packaging.update(packagingNewData, { where })
  return saved
}

exports.deletepackaging = async (where = {}) => {
  await Packaging.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findpackagings = async (where = {}) => {
  const packagings = await Packaging.findAll({ where })
  return packagings
}

exports.findpackaging = async (where = {}) => {
  const packaging = await Packaging.findOne({
    where,
    include: [
      {
        model: Packaging,
        attributes: ['_id', 'partner', 'packaging', 'title'],
      },
    ],
  })
  return packaging ? packaging : {}
}
