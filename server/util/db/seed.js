var config = require('../../config/config')
var logger = require('../logger')
var moment = require('moment')
var _ = require('lodash')
var DB = require('./index')

// import models
var ActionEvents = require('../../api/actionEvents/actionEvents.model')
var { Announcement } = require('../../api/announcements/announcement.model')
var { Message } = require('../../api/messageBoard/message.model')
var { TripDoc } = require('../../api/tripDocuments/tripDoc.model')
var { Community } = require('../../api/community/community.model')
var { Country } = require('../../api/country/country.model')
var { Organization } = require('../../api/organization/organization.model')
var Packaging = require('../../api/packaging/packaging.model')
var { Page } = require('../../api/page/page.model')
var { Partner } = require('../../api/partners/partner.model')
var { Policy } = require('../../api/policy/policy.model')
var { Trip } = require('../../api/trip/trip.model')
var { TripRole } = require('../../api/tripRole/tripRole.model')
var { User } = require('../../api/user/user.model')

const dbs = [
  Partner,
  User,
  Policy,
  Country,
  Community,
  Organization,
  Trip,
  TripRole,
  Page,
  Packaging,
  Message,
  TripDoc,
  Announcement,
  ActionEvents,
]

// import helpers
// var adminHelper = require('../../api/admin/admin.helper')

var partners = [
  {
    name: '410 Bridge',
  },
  {
    name: 'Gates Foundation',
  },
]
var policies = [
  {
    name: 'root',
    createPartner: true,
    updatePartnerInfo: true,
    deleteData: true,
    sendNotification: true,
    makeTripActive: true,
  },
  {
    name: 'admin',
    createPartner: false,
    updatePartnerInfo: true,
    deleteData: true,
    sendNotification: true,
    makeTripActive: true,
  },
  {
    name: 'trip-access',
    createPartner: false,
    updatePartnerInfo: false,
    deleteData: false,
    sendNotification: true,
    makeTripActive: true,
  },
  {
    name: 'delete-access',
    createPartner: false,
    updatePartnerInfo: false,
    deleteData: true,
    sendNotification: false,
    makeTripActive: false,
  },
  {
    name: 'partner-access',
    createPartner: false,
    updatePartnerInfo: true,
    deleteData: false,
    sendNotification: true,
    makeTripActive: false,
  },
]
var users = [
  {
    name: 'Ayman',
    email: 'ayman@test.com',
    policy: 'root',
    password: 'testtest',
  },
  {
    name: 'Sakib',
    email: 'sakib@test.com',
    policy: 'admin',
    password: 'testtest',
  },
  {
    name: 'Dhruba',
    email: 'dhruba@test.com',
    policy: 'trip-access',
    password: 'testtest',
  },
  {
    name: 'Prithila',
    email: 'prithila@test.com',
    policy: 'delete-access',
    password: 'testtest',
  },
  {
    name: 'Maliha',
    policy: 'partner-access',
    email: 'maliha@test.com',
    password: 'testtest',
  },
]
var countries = [
  {
    name: 'Bangladesh',
  },
  {
    name: 'India',
  },
  {
    name: 'China',
  },
  {
    name: 'Japan',
  },
  {
    name: 'Hongkong',
  },
  {
    name: 'Korea',
  },
  {
    name: 'South Africa',
  },
]
var communities = [
  {
    name: 'Bogra',
  },
  {
    name: 'Dhaka',
  },
  {
    name: 'London',
  },
  {
    name: 'Tokyo',
  },
  {
    name: 'Veana',
  },
  {
    name: 'Ladakh',
  },
  {
    name: 'Soul',
  },
  {
    name: 'Paris',
  },
  {
    name: 'Chembulet',
  },
]
var organizations = [
  {
    name: 'church 1',
  },
  {
    name: 'church 2',
  },
  {
    name: 'church 3',
  },
  {
    name: 'church 4',
  },
]

var trips = [
  {
    name: 'Boddha Bihar Trip',
    start_date: moment().add(5, 'days'),
    end_date: moment().add(10, 'days'),
    is_active: true,
  },
  {
    name: `Cox's bazar trip`,
    start_date: moment().add(20, 'days'),
    end_date: moment().add(23, 'days'),
  },
  {
    name: `Sundarban trip`,
    start_date: moment().add(4, 'days'),
    end_date: moment().add(5, 'days'),
  },
  {
    name: `Paharpur Trip`,
    start_date: moment().add(80, 'days'),
    end_date: moment().add(85, 'days'),
  },
  {
    name: `Taj Mahal Trip`,
    start_date: moment().add(8, 'days'),
    end_date: moment().add(12, 'days'),
  },
  {
    name: `Rajesthan Trip`,
    start_date: moment().add(18, 'days'),
    end_date: moment().add(22, 'days'),
  },
]

var tripRoles = [
  {
    name: 'Leader',
  },
  {
    name: 'Administrator',
  },
]

var createDoc = function (model, doc) {
  return model.create(doc)
}

var getRelData = function (
  model = [],
  fieldForSearch = '',
  searchData = '',
  receivedFieledValue = ''
) {
  return model.find((el) => el[fieldForSearch] === searchData)[
    receivedFieledValue
  ]
}

var cleanDB = async function () {
  logger.log('... cleaning the DB 💥 📦 📦 📦 💥')
  var cleanPromises = dbs.map(function (model) {
    return model.destroy({ where: {} })
  })
  return await Promise.all(cleanPromises)
}

var addMessage = function (data, msg) {
  data = data || {}
  data.msg = data.msg || []
  data.msg.push(msg)
  return data
}

var groupBy = function (xs, key) {
  let obj = xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
  return Object.values(obj)
}

var randomNumber = (max = 1) => Math.floor(Math.random() * max)

var createPartner = async function (data) {
  var promises = partners.map((partner) => createDoc(Partner, partner))

  const addedPartners = await Promise.all(promises)
  data = addMessage(data, `➕  added ${addedPartners.length} partners 🏣 🏤 🏥`)
  return _.merge({ partners: addedPartners }, data || {})
}
var createPolicies = async function (data) {
  var promises = []
  data.partners.forEach((partner) => {
    policies.forEach((policy) => {
      policy.partnerId = partner._id
      promises.push(createDoc(Policy, policy))
    })
  })
  const addedPolicies = await Promise.all(promises)
  data = addMessage(data, `➕  added ${addedPolicies.length} policies 📃 📄 📜`)
  return _.merge({ policies: addedPolicies }, data || {})
}
var createTriRoles = async function (data) {
  var promises = []
  data.partners.forEach((partner) => {
    tripRoles.forEach((tripRole) => {
      tripRole.partnerId = partner._id
      promises.push(createDoc(TripRole, tripRole))
    })
  })
  const addedTripRoles = await Promise.all(promises)
  data = addMessage(
    data,
    `➕  added ${addedTripRoles.length} trip roles 👦 👧 👨`
  )
  return _.merge({ tripRoles: addedTripRoles }, data || {})
}
var createUsers = async function (data) {
  var promises = users.map((user) => {
    // user.partner = data.partners[randomNumber(data.partners.length)]._id
    return createDoc(User, user)
  })

  let addedUsers = await Promise.all(promises)
  addedUsers = await Promise.all(
    (() => {
      let addedPoliciesAndPartners = []
      addedUsers.forEach((user) => {
        data.partners.forEach((partner) => {
          const policyId = data.policies.find(
            (policy) =>
              policy.partnerId == partner._id &&
              policy.name == getRelData(users, 'email', user.email, 'policy')
          )._id
          addedPoliciesAndPartners.push(user.addPartner(partner._id))
          addedPoliciesAndPartners.push(user.addPolicy(policyId))
        })
      })
      return addedPoliciesAndPartners
    })()
  )
  data = addMessage(data, `➕  added ${addedUsers.length} users 👦 👧 👨`)
  return _.merge({ users: addedUsers }, data || {})
}
var createCountries = async function (data) {
  var promises = countries.map((country) => {
    country.partnerId = data.partners[randomNumber(data.partners.length)]._id
    return createDoc(Country, country)
  })

  const addedCountries = await Promise.all(promises)
  data = addMessage(data, `➕  added ${addedCountries.length} countries 🇧🇩 🇮🇳`)
  return _.merge({ countries: addedCountries }, data || {})
}
var createOrganizations = async function (data) {
  var promises = organizations.map((org) => {
    org.partnerId = data.partners[randomNumber(data.partners.length)]._id
    return createDoc(Organization, org)
  })

  const addedOrganizations = await Promise.all(promises)
  data = addMessage(
    data,
    `➕  added ${addedOrganizations.length} organizations 🏛 ⛪️`
  )
  return _.merge({ organizations: addedOrganizations }, data || {})
}

var createCommunities = async function (data) {
  var promises = communities.map((community) => {
    community.partnerId = data.partners[randomNumber(data.partners.length)]._id
    const countries = data.countries.filter(
      (country) => country.partnerId == community.partnerId
    )
    community.countryId = countries[randomNumber(countries.length)]._id
    return createDoc(Community, community)
  })

  const addedCommunities = await Promise.all(promises)
  data = addMessage(
    data,
    `➕  added ${addedCommunities.length} communities 🏜 🌋 🗽`
  )
  return _.merge({ communities: addedCommunities }, data || {})
}
var createTrips = async function (data) {
  var promises = trips.map((trip) => {
    trip.partnerId = data.partners[randomNumber(data.partners.length)]._id
    const countries = data.countries.filter(
      (country) => country.partnerId == trip.partnerId
    )
    trip.countryId = countries[randomNumber(countries.length)]._id
    return createDoc(Trip, trip)
  })

  const addedTrips = await Promise.all(promises)
  data = addMessage(data, `➕  added ${addedTrips.length} trips 🚗 🚙 🚌`)
  return _.merge({ trips: addedTrips }, data || {})
}

cleanDB()
  .then(createPartner)
  .then(createPolicies)
  .then(createUsers)
  .then(createCountries)
  .then(createCommunities)
  .then(createOrganizations)
  .then(createTrips)
  .then(createTriRoles)
  .then(({ msg }) => {
    msg.forEach((el) => {
      logger.log(el)
    })
    if (config.env.includes('seed')) process.exit(0)
  })
  .catch((err) => {
    logger.error(err)
  })
