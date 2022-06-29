var config = require('../../config/config')
var logger = require('../logger')
const Sequelize = require('sequelize')
const Umzug = require('umzug')
const path = require('path')

const wkx = require('wkx')
Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`
}
Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`
}
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`
}
Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`
}

const db = new Sequelize(
  config.db.dbName,
  config.db.username,
  config.db.password,
  {
    host: config.db.hostname,
    port: config.db.port,
    dialect: 'mysql',
    // logging: () => {},
    logging: config.dbLog ? console.log : () => {},
    define: {
      freezeTableName: true,
    },
  }
)

db.authenticate()
  .then(async () => {
    logger.log(`⚡️ Connected to database > ${db.getDatabaseName()} 🖥 `)
    // var User = require('../../api/user/user.model')
    // var Partner = require('../../api/partners/partner.model')
    // var Policy = require('../../api/policy/policy.model')
    // var Country = require('../../api/country/country.model')
    // var Organization = require('../../api/organization/organization.model')
    // var Trip = require('../../api/trip/trip.model')
    // await db.sync({ force: true })
    // const partner = await PartnerModel.create({name: 'google'})
    // const user = await UserModel.create({name: 'Ayman', email: 'test@test.com', password: 'aa', partner: partner.id})
    // await db.drop()
    // db.sync({ force: true })
    // require('./seed')

    if (config.seed) {
      require('./seed')
    }
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err)
  })

module.exports = db

// var db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function() {
//   // we're connected!
//   logger.log('⚡️ Connected to database 🖥 🖥 🖥')
// })
// database = config.db.url.split('/')
// logger.log(
//   `⚡️ Connecting to ${database[0]}=> ${database[database.length - 1]}`
// )
