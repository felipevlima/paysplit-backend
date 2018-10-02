const { Receipt } = require('../db/models');
const asyncHandler = require('express-async-handler');

module.exports = function(app) {

  //retrieve all items ever scanned
  app.get('/', asyncHandler(async (req, res, next) => {
    const everyItemEverPurchased = await Receipt.findAll()
    res.json(everyItemEverPurchased)
  }))

  //create bulk entry for receipt
  // app.post('/', (req, res) => {
  //   // console.log(req.body)
  //   const receipt = Receipt.bulkCreate(req.body, {returning: true})
  router.post('/', asyncHandler(async (req, res, next) => {
  // console.log(req.body)
  const receipt = await Receipt.bulkCreate(req.body, {returning: true})
    console.log("********",req.body)
    // const receipt = await Receipt.findAll()
    if (receipt.length === 0) {
      return res.send('no entries returned').status(500)
    }
    res.status(201).json(receipt)
  }))

  app.delete('/:id', asyncHandler(async (req, res, next) => {
    await Receipt.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(204)
  }))

}
