//const { Receipt } = require('../db/models');
const fetch = require("fetch")
const asyncHandler = require('express-async-handler');
const models = require('../db/models');
//const Items = require('../db/models/item.js')
const {runapp} = require('../receipts.js');
const {convertReceiptFromURL} = require('./taggun.js')
const request = require('request');
require('es6-promise').polyfill();
require('isomorphic-fetch');

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

  // app.get('/receipt/:id', (req, res) => {
  //   const recId = req.params.id
  //   models.Receipt.findById(receiptId).then(() => {
  //     res.json({msg: 'receipt show'})
  //   })
  // })

  // app.post('/records', (req, res) => {
  //   let recURLs = {
  //     url: req.body.url,
  //     userToken: req.body.userToken,
  //     user_id: req.body.user_id
  //   };
  //
  //   const formData = req.body.url => ({
  //     url: url,
  //     headers: {
  //       'x-custom-key': 'string'
  //     },
  //     refresh: false,
  //     incognito: false,
  //     ipAddress: '32.4.2.223',
  //     language: 'en'
  //   }).then((url) => {
  //   const body = formData(url)
  //   console.log(body)
  //   const myRequest = new Request('https://api.taggun.io/api/receipt/v1/verbose/url', {method: 'POST', body: body, headers: { apikey: process.env.TAGKEY }});
  //   const dataObj = response.data
  //   console.log(dataObj)
  //   return dataObj
  // })
  // console.log("YAAAS ", dataObj)
  //
  // });


  app.delete('/:id', asyncHandler(async (req, res, next) => {
    await Receipt.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(204)
  }))

}
