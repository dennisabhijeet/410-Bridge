var router = require('express').Router()

router.route('/').get((req, res) => {
  res.json({
    api: 'Powered by 410 Bridge',
    author: 'Steve Smith'
  })
})

module.exports = router
