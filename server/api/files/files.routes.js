var auth = require('../auth/auth.helpers')
var checkUser = [auth.decodeToken(), auth.getFreshUser()]
var router = require('express').Router()
var controller = require('./files.controller')
var { catchErrors } = require('../../handlers/errorHandlers')

router.post('/', checkUser, catchErrors(controller.getUploadUrl))
router.get(
  '/:category/:fileKey',
  checkUser,
  catchErrors(controller.redirectToDownloadUrl)
)

module.exports = router
