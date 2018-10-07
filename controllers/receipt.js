//const { Receipt } = require('../db/models');
const asyncHandler = require('express-async-handler');
const models = require('../db/models');

module.exports = function(app) {



  //retrieve all items ever scanned
  // app.get('/', asyncHandler(async (req, res, next) => {
  //   const everyItemEverPurchased = await Receipt.findAll()
  //   res.json(everyItemEverPurchased)
  // }))

  //create bulk entry for receipt
  // app.post('/', (req, res) => {
  //   // console.log(req.body)
  //   const receipt = Receipt.bulkCreate(req.body, {returning: true})
  app.post('/', asyncHandler(async (req, res, next) => {
  // console.log(req.body)
  const receipt = await models.Receipt.bulkCreate(req.body, {returning: true})
    //console.log("********",req.body)
    // const receipt = await Receipt.findAll()
    if (receipt.length === 0) {
      return res.send('no entries returned').status(500)
    }
    res.status(201).json(receipt)
  }))



  app.post('/receipts', (req, res) => {
    var newReceipt = {
      merchant: req.body.merchant,
      product: req.body.product,
      price: req.body.price,
      date: req.body.date
    }
    models.Receipt.create(newReceipt, {w:1}).then((savedReceipt) => {
      res.status(200).json({message: 'Receipt stored successfully'})
    }).catch((err) => {
      res.json(err)
    })
  });

  app.delete('/:id', asyncHandler(async (req, res, next) => {
    await Receipt.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(204)
  }))

}
