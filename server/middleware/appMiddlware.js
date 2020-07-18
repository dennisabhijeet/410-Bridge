var morgan = require('morgan')
var bodyParser = require('body-parser')
var cors = require('cors')
var helmet = require('helmet')
var history = require('connect-history-api-fallback')
// setup global middleware here

module.exports = function (app) {
  app.use(morgan('dev'))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cors())
  app.use(helmet())
  // app.use(history())
}
