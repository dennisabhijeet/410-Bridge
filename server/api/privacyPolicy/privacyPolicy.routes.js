var router = require('express').Router();
var controller = require('./privacyPolicy.controller');
var auth = require('../auth/auth.helpers');
var checkUser = [auth.decodeToken(), auth.getFreshUser()]
var { catchErrors } = require('../../handlers/errorHandlers');

router.route('/')
    .get(checkUser,catchErrors(controller.get))
    .put(checkUser, catchErrors(controller.put))

module.exports = router
