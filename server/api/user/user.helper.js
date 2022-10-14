const Sequelize = require('sequelize')
const sequelize = require('../../util/db')
const { User, UserPartner, UserPolicy } = require('./user.model')
const parnerHelper = require('../partners/partner.helper')
const { Partner } = require('../partners/partner.model')
const { Policy } = require('../policy/policy.model')
const { Trip } = require('../trip/trip.model')
const { TripUser } = require('../tripUsers/tripUser.model')
const _ = require('lodash')
const { sendMailCreateUser } = require('../../services/email')
const { getRandomString } = require('../../util/helpers')

/**
 * email
 * name
 * partnerId
 * policyId: ?
 */

exports.createUser = async (userData) => {
  // genrate new password (for now password is password)
  const password = getRandomString() + getRandomString()
  // find User
  let user = await User.findOne({ where: { email: userData.email } })
  const partner = await parnerHelper.findPartner({ _id: userData.partnerId })

  // if no user found create User
  if (!user) {
    user = await User.create({ ...userData, password })
    const username = user.name.split(' ')[0]
    // send mail for creating user
    await sendMailCreateUser({
      mailSubject: `Welcome ${username} to ${partner.name}`,
      email: user.email,
      password: password,
      name: username,
      partnerName: partner.name,
    }).catch(console.error)
  } else {
    const username = user.name.split(' ')[0]
    // send mail for creating user
    sendMailCreateUser({
      mailSubject: `Welcome ${username} to ${partner.name}`,
      email: user.email,
      name: username,
      partnerName: partner.name,
    }).catch(console.error)
  }
  const addAssociationsPromise = []
  // add Partner
  addAssociationsPromise.push(user.addPartner(userData.partnerId))
  if (userData.policyId) {
    // add Policy if its there
    addAssociationsPromise.push(user.addPolicy(userData.policyId))
  }
  await Promise.all(addAssociationsPromise)
  return user
}
exports.createMultipleUsers = async (usersData, partnerId) => {
  // genrate new password (for now password is password)
  const passwords = []

  // add users if not found
  const userPromises = usersData.map((user) => {
    const password = getRandomString() + getRandomString()
    passwords.push(password)
    return User.findOrCreate({
      where: { email: user.email },
      defaults: { ...user, password },
    })
  })
  const users = await Promise.all(userPromises)
  const partner = await parnerHelper.findPartner({ _id: partnerId })
  const usersPartnerPromise = users.map(([user, created], i) => {
    if (created) {
      const username = user.name.split(' ')[0]
      sendMailCreateUser({
        mailSubject: `Welcome ${username} to ${partner.name}`,
        email: user.email,
        password: passwords[i],
        name: username,
        partnerName: partner.name,
      }).catch(console.error)
    }
    return user.addPartner(partnerId)
  })

  await Promise.all(usersPartnerPromise)
  return users.map(([user]) => user)
}

exports.updateUser = async (
  where = {},
  userNewData,
  { _id = 0, policies = [] },
  partnerId
) => {
  const user = await User.findOne({ where })
  await user.update(userNewData)
  if (userNewData.policyId && +userNewData.policyId > 0) {
    const oldPolicy = policies.find((policy) => policy.partnerId == partnerId)
    if (oldPolicy) {
      const oldPolicyId = oldPolicy._id
      await UserPolicy.update(
        { policyId: userNewData.policyId },
        { where: { userId: _id, policyId: oldPolicyId } }
      )
    } else {
      await UserPolicy.create({
        userId: _id,
        policyId: userNewData.policyId,
      })
    }
  }
  delete userNewData.password
  return userNewData
}

exports.deleteUser = async (where = {}, partnerId = 0, policyId = 0) => {
  let user = await User.findOne({
    where,
    include: [
      {
        model: Partner,
        attributes: ['_id'],
      },
    ],
  })
  if (user.partners.length > 1) {
    await UserPartner.destroy({
      where: { userId: user._id, partnerId: partnerId },
    })
    if (policyId) {
      await UserPolicy.destroy({
        where: { userId: user._id, policyId: policyId },
      })
    }
    await user.removeTrip({
      where: { partnerId: partnerId },
    })
  } else {
    await user.destroy()
  }
  return { _id: where._id, removed: true }
}

// exports.findUsers = async (where = {}, partnerId = 0) => {
//   const partner = await findPartner({ _id: partnerId })
//   const users = await partner.getUsers({ where })
//   return users.map((user) => user.toJson())
// }
exports.findUsers = async ({ where, offset, limit, order }, partnerId) => {
  const users = await User.findAll({
    where,
    attributes: {
      include: [
        [Sequelize.fn('COUNT', sequelize.col('trips._id')), 'trips_count'],
      ],
      exclude: ['password'],
    },
    subQuery: false,
    include: [
      {
        model: Trip,
        as: 'trips',
        duplicating: false,
        attributes: [],
        required: false,
      },
      {
        model: Partner,
        attributes: ['_id'],
        where: {
          _id: partnerId,
        },
      },
    ],
    group: ['users._id'],
    offset,
    order,
    limit,
  })
  // const userList = await Promise.all(
  // users.map(async (user) => {
  // let data = user.toJson()
  // const tripsCount = await user.countTrips()
  // data.trips_count = tripsCount
  // return data
  // })
  // )
  const count = await User.count({
    where,
    include: [
      {
        model: Partner,
        attributes: ['_id'],
        where: {
          _id: partnerId,
        },
      },
    ],
  })
  return {
    users,
    count,
  }
}

exports.findUsersWithPolicy = async (
  { where, offset, limit, order },
  partnerId
) => {
  const users = await User.findAll({
    where,
    offset,
    order,
    limit,
    include: [
      {
        model: Partner,
        attributes: ['name', '_id'],
        where: {
          _id: partnerId,
        },
      },
      {
        model: Policy,
        // attributes: ['name', 'id'],
        where: {
          partnerId,
        },
        required: true,
      },
    ],
  })
  const count = await User.count({
    where,
    include: [
      {
        model: Partner,
        attributes: ['_id'],
        where: {
          _id: partnerId,
        },
      },
      {
        model: Policy,
        // attributes: ['name', 'id'],
        where: {
          partnerId,
        },
        required: true,
      },
    ],
  })
  return { users: users.map((user) => user.toJson()), count }
}

exports.findUser = async (where = {}, partnerId = 0) => {
  const includePartnerWhere = {}
  const includePolicyWhere = {}
  if (partnerId) {
    includePartnerWhere._id = partnerId
    includePolicyWhere.partnerId = partnerId
  }
  const user = await User.findOne({
    where,
    include: [
      {
        model: Partner,
        attributes: ['_id', 'name'],
        where: includePartnerWhere,
      },
    ],
  })
  if (!user) {
    return {}
  }
  const userData = user.toJson()
  const policies = await user.getPolicies({ where: includePolicyWhere })
  return { ...userData, policies }
}

exports.verifyPassword = async function(email, password){
    
  // look user up in the DB so we can check
  // if the passwords match for the email
  const user = await  User.findOne({
    where: { email: email },
    include: [{ model: Policy }, { model: Partner }],
  })
   
 return user && user.authenticate(password)
 
}

exports.deleteAccount = async function(email){
  const user = await User.findOne({where: {email}});
  return  user.destroy();
}