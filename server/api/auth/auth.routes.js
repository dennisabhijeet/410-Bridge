var router = require('express').Router()
var {
  verifyUser,
  selectPartner,
  getFreshUser,
  decodeToken,
  forgetPassGen,
  updateForgottenPass,
} = require('./auth.helpers')
var controller = require('./auth.controller')
var { catchErrors } = require('../../handlers/errorHandlers')
// before we send back a jwt, lets check
// the password and email match what is in the DB
router.post('/login', verifyUser(), controller.signin)
router.post(
  '/selectPartner',
  decodeToken(),
  getFreshUser(),
  catchErrors(selectPartner()),
  controller.signin
)
router.post('/forgetPass', forgetPassGen())
router.post('/forgetPass/:urlKey', updateForgottenPass())

module.exports = router
