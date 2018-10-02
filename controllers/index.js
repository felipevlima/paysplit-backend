
module.exports = function(app) {
  app.use('/receipt', require('./receipt'))

  // app.use((req, res, next) => {
  //     const error = new Error('Not Found')
  //     error.status = 404
  //     next(error)
  //   })

}
