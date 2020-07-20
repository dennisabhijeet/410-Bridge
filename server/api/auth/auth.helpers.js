var jwt = require('jsonwebtoken')
var config = require('../../config/config')
var { User, UserForgetPass } = require('../user/user.model')
var { Policy } = require('../policy/policy.model')
var { Partner } = require('../partners/partner.model')
var logger = require('../../util/logger')
const { getRandomString } = require('../../util/helpers')
var getToken = (auth = '') => {
  return auth.split(' ')[1]
}
const { sendMailForgetPass } = require('../../services/email')

var generateToken = (data, expiresIn) => {
  return jwt.sign(data, config.secrets.jwt, {
    expiresIn,
  })
}

var verifyToken = (token) => {
  return jwt.verify(token, config.secrets.jwt)
}

exports.decodeToken = function () {
  return function (req, res, next) {
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format
    // so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token
      delete req.query.access_token
    }
    var token = getToken(req.headers.authorization)
    try {
      data = verifyToken(token)
      req.user = data
      next()
    } catch (err) {
      next(new Error(err))
    }

    // this will call next if token is valid
    // and send error if its not. It will attached
    // the decoded token to req.user
    // checkToken(req, res, next)
  }
}

exports.getFreshUser = function () {
  return function (req, res, next) {
    // find user
    const query = {
      where: { _id: req.user._id },
      attributes: { exclude: ['password', 'managed_mission_id'] },
      include: [],
    }
    // if partner id given
    if (req.user.partnerID) {
      // get only that partner
      // query.include.push({
      //   model: Policy,
      //   where: { partner: req.user.partnerID },
      // })
      // get only that policy associated with that partner
      query.include.push({
        model: Partner,
        attributes: ['name', '_id', 'theme', 'logo'],
        where: { _id: req.user.partnerID },
      })
    } else {
      // or else just get the policies and partners
      query.include.push({
        model: Policy,
      })
      query.include.push({ model: Partner, attributes: ['name', '_id'] })
    }
    User.findOne(query).then(
      async function (user) {
        if (!user) {
          // if no user is found it was not
          // it was a valid JWT but didn't decode
          // to a real user in our DB. Either the user was deleted
          // since the client got the JWT, or
          // it was a JWT from some other source
          next(new Error('Unauthorized'))
        } else {
          // update req.user with fresh user from
          // stale token data
          if (req.user.partnerID) {
            req.policy =
              (
                await user.getPolicies({
                  where: { partnerId: req.user.partnerID },
                })
              )[0] || {}
          } else {
            req.policy = (await user.getPolicies())[0] || {}
          }
          req.user = user.toJson()
          req.user.policies = req.user.policies || [req.policy] || []
          req.userObj = user
          req.partner = req.user.partners && (req.user.partners[0] || {})
          next()
        }
      },
      function (err) {
        next(err)
      }
    )
  }
}

exports.selectPartner = function () {
  return async function (req, res, next) {
    const { partnerID } = req.body

    if (!partnerID) {
      next(new Error('A Partner must be selected'))
    }
    // if (req.user.policies && req.user.policies.length) {
    const [policy] = await req.userObj.getPolicies({
      where: {
        partnerId: partnerID,
      },
    })
    // const policy = user.policies.find((el) => el.partner == partnerID)
    if (policy) {
      req.user.policies = [policy]
    }
    // }
    // if (req.user.partners && req.user.partners.length) {
    const [partner] = await req.userObj.getPartners({
      where: {
        _id: partnerID,
      },
    })
    // const partner = userPartners.find((el) => el._id == partnerID)
    if (partner) {
      req.user.partners = [partner]
    } else {
      next(new Error('Wrong Partner Selected'))
      return
    }
    // } else {
    //   next(new Error('Unauthorized'))
    //   return
    // }
    next()
  }
}

exports.verifyUser = function () {
  return function (req, res, next) {
    const { email, password } = req.body

    // if no email or password then send
    if (!email || !password) {
      next(new Error('You need a email and password'))
      return
    }

    // look user up in the DB so we can check
    // if the passwords match for the email
    User.findOne({
      where: { email },
      include: [{ model: Policy }, { model: Partner }],
    }).then(
      function (user) {
        if (!user) {
          next(new Error('No user with the given email address'))
        } else {
          // checking the passowords here
          if (!user.authenticate(password)) {
            next(new Error('Wrong password'))
          } else {
            // if everything is good,
            // then attach to req.user
            // and call next so the controller
            // can sign a token from the req.user._id
            req.user = user.toJson()
            next()
          }
        }
      },
      function (err) {
        next(err)
      }
    )
  }
}

exports.forgetPassGen = function () {
  return function (req, res, next) {
    const { email } = req.body

    // if no email then send
    if (!email) {
      next(new Error('You must provide an email address'))
      return
    }

    // look user up in the DB so we can check
    // if the passwords match for the email
    User.findOne({
      where: { email },
    }).then(
      async function (user) {
        if (!user) {
          next(new Error('No user with the given email address'))
        } else {
          // generate token for user
          try {
            const code = getRandomString()
            const urlKey = generateToken({ email }, config.expireTime.small)
            await UserForgetPass.destroy({ where: { userID: user._id } })
            await user.createUser_forget_pass({
              code,
              urlKey,
            })
            sendMailForgetPass({
              mailSubject: 'Requested password change for the Bridge App',
              email: email,
              name: user.name,
              code: code,
              urlKey: urlKey,
            })
            res.json({
              status: true,
              urlKey,
            })
          } catch (err) {
            logger.error(err)
            res.json({
              status: false,
            })
          }
        }
      },
      function (err) {
        next(err)
      }
    )
  }
}

exports.updateForgottenPass = function () {
  return function (req, res, next) {
    const { urlKey } = req.params
    const { code, password } = req.body

    // if no urlKey, code and password then send
    if (!urlKey || !code || !password) {
      next(new Error('You must provide the key, code and the new password'))
      return
    }

    try {
      const { email } = verifyToken(urlKey)
      // look user up in the DB so we can check
      User.findOne({
        where: { email },
      }).then(async function (user) {
        if (!user) {
          next(new Error('No user with the given email address'))
        } else {
          try {
            const [forgetPass] = await user.getUser_forget_passes()
            if (!forgetPass || !forgetPass.code) {
              // someone trying to hack
              next(
                new Error('Code Expired, try requesting forget password again')
              )
              return
            }
            if (forgetPass.code != code) {
              next(new Error('Wrong Code'))
              return
            }
            await user.update({
              password,
            })
            await UserForgetPass.destroy({ where: { userID: user._id } })
            res.json({
              status: true,
            })
          } catch (err) {
            next(err)
          }
        }
      }, next)
    } catch (err) {
      next(new Error('Code Expired, try requesting forget password again'))
    }
  }
}

// util method to sign tokens on signup
exports.signToken = function (user) {
  const data = { _id: user._id }
  if (user.partners && user.partners.length == 1) {
    data.partnerID = user.partners[0]._id
  }
  return generateToken(data, config.expireTime.large)
}
