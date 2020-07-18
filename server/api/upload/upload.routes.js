var router = require('express').Router()
var controller = require('./upload.controller')
var auth = require('../auth/auth.helpers')
var checkUser = [auth.decodeToken(), auth.getFreshUser()]
var { catchErrors } = require('../../handlers/errorHandlers')
var path = require('path')
var fs = require('fs')
var multer = require('multer')
var logger = require('../../util/logger')

const checkUploadPath = function (req, res, next) {
  // let root = path.join(__dirname, '../../uploads/image/public')
  let root = 'server/uploads/image/public'
  let dest = `${root}/${req.user.cat}/${req.user.profile._id}/`
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  next()
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // let root = path.join(__dirname, '../../uploads/image/public')
    let root = 'server/uploads/image/public'
    let dest = `${root}/${req.user.cat}/${req.user.profile._id}/`
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
})

router
  .route('/image')
  .post(checkUser, checkUploadPath, upload.single('image'), (req, res) => {
    res.json(req.file)
  })

// router.route('/file').post(checkUser, catchErrors(controller.post))

module.exports = router
