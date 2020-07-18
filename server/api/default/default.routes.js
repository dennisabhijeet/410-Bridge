var router = require('express').Router()

router.route('/').get((req, res) => {
  res.json({
    api: 'Powered by Dexter',
    author: 'Mir Ayman Ali'
  })
})

module.exports = router
