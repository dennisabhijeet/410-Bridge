var express = require('express')
var app = express()
var server = require('./util/socket').socketIO(app)
var api = require('./api/api')
var path = require('path')
var errorHandlers = require('./handlers/errorHandlers')

// Connect to database
require('./util/db')

// setup the app middlware
require('./middleware/appMiddlware')(app)

// setup default route vue
// app.use('/', express.static(path.join(__dirname, 'dist')))
app.use('/', require('../server/api/default/default.routes'))

// setup publicly uploaded image folder
// app.use(
//   '/images',
//   express.static(path.join(__dirname, './uploads/image/public'))
// )

// setup the api
app.use('/v1', api)

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound)

// schedulers with cron job
require('./schedulers')

// Development error handler
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors)
}

// production error handler
app.use(errorHandlers.productionErrors)

// export the app for testing
module.exports = server
