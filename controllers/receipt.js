//const { Receipt } = require('../db/models');
const fetch = require("fetch")
const asyncHandler = require('express-async-handler');
const models = require('../db/models');
const {runapp} = require('../receipts.js');

module.exports = function(app) {

  // app.post('/api/img', (req, res) => {
  //   let receiptURLs = {
  //     url: req.body.url
  //   };
  //   if (receiptURLs.length === 0) {
  //     return res.send('no entries returned').status(500)
  //   }
  //   .fetch(runapp(receiptURLs)).then((res) => res.json())
  //   .then((data) => {
  //     res.status(200).json(imageData)
  //   })
  // })




  //retrieve all items ever scanned
  app.get('/test', asyncHandler(async (req, res, next) => {
    const everyItemEverPurchased = await models.Receipts.findAll()
    res.json(everyItemEverPurchased)
  }))

  //create bulk entry for receipt
  app.post('/', asyncHandler(async (req, res, next) => {
  // console.log(req.body)
  const receipt = await models.Receipt.bulkCreate(req.body, {returning: true})
    if (receipt.length === 0) {
      return res.send('no entries returned').status(500)
    }
    res.status(201).json(req.body)
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
