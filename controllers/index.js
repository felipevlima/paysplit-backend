
module.exports = function(app) {
  //app.use('/receipt', require('./receipt'))

  // app.use((req, res, next) => {
  //     const error = new Error('Not Found')
  //     error.status = 404
  //     next(error)
  //   })

  // Express sanitizer
  router.post('/', function(req, res, next) {
    // replace an HTTP posted body property with the sanitized string
    req.body.sanitized = req.sanitize(req.body.propertyToSanitize);
    // send the response
    res.send('Your value was sanitized to: ' + req.body.sanitized);
  });

}
