//const { Receipt } = require('../db/models');
const asyncHandler = require('express-async-handler');
const models = require('../db/models');
//const Items = require('../db/models/item.js')
const {runapp} = require('../receipts.js');
const {convertReceiptFromURL} = require('./taggun.js')
const request = require('request');


module.exports = function(app) {

  app.post('/api/img', (req, res) => {
    let receiptURLs = {
      url: req.body.url,
      userToken: req.body.userToken,
      user_id: req.body.user_id
    };
    //TODO: Create socket(chanel) for -> iOs client.
    // if (receiptURLs.length === 0) {
    //   return res.send('no entries returned').status(500)
    // }
    const user_ID = req.body.user_id
    // console.log(userId)
    console.log(receiptURLs)
    runapp(receiptURLs, user_ID)
    res.status(200).json({message:"Image received successfully"})
  });

  //retrieve all items ever scanned
  app.get('/test', asyncHandler(async (req, res, next) => {
    const everyItemEverPurchased = await models.Receipt.findAll()
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

  app.put('/receipt/:id/edit', (req, res) => {
    models.Receipt.update(receiptId).then((receipt) => {
      res.status(200)
      res.json({receipt})
      console.log("Update successfully" + receipt);
    }).catch((err) => {
      if(err) {
        res.status(400);
        res.json({msg: 'ERROR could not update.'})
      }
    })
  })

  app.get('/receipt/:id', (req, res) => {
    const recId = req.params.id
    models.Receipt.findById(recId).then(() => {
      res.json({msg: 'receipt show', recId})
    })
  })

  app.delete('/:id', asyncHandler(async (req, res, next) => {
    await Receipt.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(204)
  }))

}
