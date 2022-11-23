var router = require('express').Router()
var controller = require('./user.controller')
var auth = require('../auth/auth.helpers')
var checkUser = [auth.decodeToken(), auth.getFreshUser()]
var { catchErrors } = require('../../handlers/errorHandlers')

// setup boilerplate route jsut to satisfy a request
// for building
router.param('id', catchErrors(controller.params))
router.get('/me', checkUser, controller.me)

// TODO: Check if any request is actaully needed
router
  .route('/')
  .get(checkUser, catchErrors(controller.get))
  .post(checkUser, catchErrors(controller.post))

router
  .route('/:id')
  .get(checkUser, catchErrors(controller.getOne))
  .put(checkUser, catchErrors(controller.put))
  .delete(checkUser, catchErrors(controller.delete))

router.route('/deleteAccount')
  .post(checkUser, catchErrors(controller.deleteAccount))

module.exports = router
