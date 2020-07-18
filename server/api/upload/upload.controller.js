// var User = require('./user.model')
// var _ = require('lodash')
var signToken = require('../auth/auth.helpers').signToken
var userHelper = require('./upload.helper')
var config = require('../../config/config')

exports.post = async (req, res, next) => {
  // if (!(req.user.cat === 'admin') && !(req.user._id === req.params.id)) {
  //   next(new Error('Unauthorized'))
  //   return
  // }
  // if (req.user.is_admin) {
  // } else if (req.user.is_staff) {
  //   delete req.body.is_admin
  // } else {
  //   delete req.body.is_admin
  //   delete req.body.is_staff
  //   delete req.body.is_creator
  //   delete req.body.vendor_count
  // }

  const newUser = await userHelper.createUser(req.body)
  newUser.token = signToken(newUser)
  res.status(201).json(newUser)
}
