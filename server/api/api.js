var router = require('express').Router()

// api router will mount other routers
// // for all our resources
router.use('/', require('./default/default.routes'))
// router.use(
//   '/partners',
//   require('./partners/partner.routes')
// )
router.use('/auth', require('./auth/auth.routes'))

router.use('/partners', require('./partners/partner.routes'))
router.use('/policies', require('./policy/policy.routes'))
router.use('/users', require('./user/user.routes'))

router.use('/countries', require('./country/country.routes'))
router.use('/communities', require('./community/community.routes'))
router.use('/organizations', require('./organization/organization.routes'))

router.use('/trips', require('./trip/trip.routes'))
router.use('/tripRoles', require('./tripRole/tripRole.routes'))
router.use('/tripUsers', require('./tripUsers/triUser.routes'))
router.use('/tripMessages', require('./messageBoard/message.routes'))
router.use('/tripDocuments', require('./tripDocuments/tripDoc.routes'))

router.use('/pages', require('./page/page.routes'))

router.use('/files', require('./files/files.routes'))
router.use('/notifications', require('./notifications/notification.routes'))
router.use('/announcements', require('./announcements/announcement.routes'))
router.use('/privacyPolicy', require('./privacyPolicy/privacyPolicy.routes'))

// // file upload
// router.use('/files', require('./upload/upload.routes'))

module.exports = router
