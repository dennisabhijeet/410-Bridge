const { Partner } = require('./partner.model')
const { User } = require('../user/user.model')
const userHelper = require('../user/user.helper')
const { createTripRole } = require('../tripRole/tripRole.helper')
const { createPolicy } = require('../policy/policy.helper')
const logger = require('../../util/logger')

/**
 * name
 * logo
 * theme
 * description
 * username
 * email
 * */

exports.createPartner = async (partnerData, adminUser) => {
  // create Partner
  const newPartner = await Partner.create(partnerData)
  const policy = {
    name: 'Admin',
    partnerId: newPartner._id,
    createPartner: false,
    updatePartnerInfo: true,
    deleteData: true,
    sendNotification: true,
    makeTripActive: true,
  }
  // create admin policy
  const newPolicy = await createPolicy(policy)
  const user = {
    name: partnerData.username,
    email: partnerData.email,
    partnerId: newPartner._id,
    policyId: newPolicy._id,
  }
  // create admin user
  await userHelper.createUser(user)
  await adminUser.addPolicy(newPolicy)
  let data = await adminUser.addPartner(newPartner)
  // create Trip Roles
  const tripRoleComon = {
    name: 'Common',
    partnerId: newPartner._id,
  }
  const tripRoleLeader = {
    name: 'Leader',
    partnerId: newPartner._id,
  }
  await createTripRole(tripRoleComon)
  await createTripRole(tripRoleLeader)
  return newPartner
}

exports.updatePartner = async (where = {}, partnerNewData) => {
  await Partner.update(partnerNewData, { where })
  return partnerNewData
}

exports.deletePartner = async (where = {}) => {
  await Partner.destroy({ where })
  return { _id: where._id, removed: true }
}

exports.findPartners = async ({ userId }) => {
  const user = await User.findOne({ where: { _id: userId } })
  let partners = await user.getPartners()
  const policies = await user.getPolicies()
  partners = JSON.parse(JSON.stringify(partners)).map((partner) => {
    partner.policy = policies.find((policy) => policy.partnerId == partner._id)
    return partner
  })
  return partners
}

exports.findPartner = async (where = {}) => {
  const partner = await Partner.findOne({
    where,
  })
  return partner ? partner : {}
}
