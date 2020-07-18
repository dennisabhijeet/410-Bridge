var logger = require('../util/logger')
/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = fn => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next)
  }
}

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
}

/*
  Development Error Hanlder
*/
exports.developmentErrors = (err, req, res, next) => {
  // if error thrown from jwt validation check
  if (err.message === 'Unauthorized') {
    res.status(401).json({
      success: false,
      msg: 'Invalid access'
    })
    return
  }

  // console.log(req);
  logger.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    msg: err.message
  })
}

/*
  Production Error Hanlder
*/
exports.productionErrors = (err, req, res, next) => {
  // if error thrown from jwt validation check
  if (err.message === 'Unauthorized') {
    res.status(401).json({
      success: false,
      msg: 'Invalid access'
    })
    return
  }
  if (err.status === 404) {
    res.status(404).json({
      success: false,
      msg: err.message
    })
    return
  }

  res.status(err.status || 500).json({
    success: false,
    msg: err.message
  })
}
