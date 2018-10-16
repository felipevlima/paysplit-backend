<<<<<<< HEAD
/* eslint-disable no-console */
=======
>>>>>>> changed db models
const asyncHandler = require('express-async-handler');
const { Router } = require('express');
const models = require('../db/models');
<<<<<<< HEAD
const { runapp } = require('../utils/receipts.js');
const { convertReceiptFromURL } = require('./taggun.js');

const router = Router();

router.post('/api/img', (req, res) => {
  const receiptURLs = {
    url: req.body.url,
    userToken: req.body.userToken,
    user_id: req.body.user_id,
  };
  console.log(receiptURLs);
  runapp(receiptURLs, req.body.user_id);
  res.status(200).json({ message: 'Image received successfully' });
});

// retrieve all items ever scanned
router.get('/test', async (req, res) => {
  const everyItemEverPurchased = await models.Receipt.findAll();
  res.json(everyItemEverPurchased);
});

router.post('/', asyncHandler(async (req, res) => {
=======
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
>>>>>>> changed db models
  // console.log(req.body)
  const receipt = await models.Receipt.bulkCreate(req.body, { returning: true });
  if (receipt.length === 0) {
    return res.send('no entries returned').status(500)
  }
  res.status(201).json(req.body);
}));

router.put('/receipt/:id/edit', (req, res) => {
  models.Receipt.update(req.params.id)
    .then((receipt) => {
      res.status(200).json({ receipt });
      console.log(`Update successfully: ${receipt}`);
    }).catch((err) => {
      if (err) {
        res.status(400).json({ msg: 'ERROR could not update.' });
      }
    });
});

router.get('/receipt/:id', (req, res) => {
  const receiptId = req.params.id;
  models.Receipt.findById(receiptId).then(() => {
    res.json({ msg: 'receipt show', receiptId });
  });
});

router.delete('/:id', asyncHandler(async (req, res) => {
  await models.Receipt.destroy({
    where: { id: req.params.id },
  });
  res.status(204);
}));

module.exports = router;
