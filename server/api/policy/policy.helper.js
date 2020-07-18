const { Policy } = require('./policy.model')
const { Partner } = require('../partners/partner.model')
const Sequalize = require('sequelize')
/**
 * name
 * partner
 * createPartner
 * updatePartnerInfo
 * deleteData
 * sendNotification
 * makeTripActive
 */

exports.createPolicy = async (policyData) => {
  const policy = await Policy.create(policyData)
  return policy
}

exports.updatePolicy = async (where = {}, policyNewData) => {
  await Policy.update(policyNewData, { where })
  return policyNewData
}

exports.deletePolicy = async (where = {}) => {
  await Policy.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findPolicies = async (where = {}) => {
  const policys = await Policy.findAll({ where })
  return policys.map((policy) => policy)
}

exports.findPolicy = async (where = {}) => {
  const policy = await Policy.findOne({
    where,
    include: [{ model: Partner, attributes: ['_id', 'name'] }],
  })
  return policy ? policy : {}
}
