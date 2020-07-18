var router = require('express').Router()
var controller = require('./announcement.controller')
var auth = require('../auth/auth.helpers')
var checkUser = [auth.decodeToken(), auth.getFreshUser()]
var { catchErrors } = require('../../handlers/errorHandlers')

router.param('id', catchErrors(controller.params))

router
  .route('/')
  .get(checkUser, catchErrors(controller.get))
  .post(checkUser, catchErrors(controller.post))

router
  .route('/:id')
  .get(checkUser, catchErrors(controller.getOne))
  .put(checkUser, catchErrors(controller.put))
  .delete(checkUser, catchErrors(controller.delete))

module.exports = router
