var router = require('express').Router()

router.route('/').get((req, res) => {
  res.json({
    api: 'Powered by 410',
    author: 'Mir Ayman Ali'
  })
})

module.exports = router
