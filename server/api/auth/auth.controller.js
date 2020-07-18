var _ = require('lodash')
var signToken = require('./auth.helpers').signToken

exports.signin = function (req, res, next) {
  // req.user will be there from the middleware
  // verify user. Then we can just create a token
  // and send it back for the client to consume
  var token = signToken(req.user)
  var userData = _.merge(req.user, { token })
  res.json(userData)
}
