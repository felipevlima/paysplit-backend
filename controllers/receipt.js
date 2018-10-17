/* eslint-disable no-console */
const asyncHandler = require('express-async-handler');
const { Router } = require('express');
const models = require('../db/models');
const { runapp } = require('../utils/receipts.js');
const { convertReceiptFromURL } = require('./taggun.js');

const router = Router();

router.post('/api/img', (req, res) => {
  //const receiptURLs = req.body.url
  runapp(req.body.url, req.body.user_id);
  res.status(200).json({ message: 'Image received successfully' });
});

// retrieve all items ever scanned
router.get('/test', async (req, res) => {
  const everyItemEverPurchased = await models.Receipt.findAll();
  res.json(everyItemEverPurchased);
});

router.post('/items', asyncHandler(async (req, res) => {
  // console.log(req.body)
  const Items = await models.Item.bulkCreate(req.body, { returning: true });
  if (Items.length === 0) {
    return res.send('no entries returned').status(500)
  }
  res.status(201).json(req.body);
}));

router.post('/records', async (req, res) => {
  const newReceipt = req.body
  const savedReceipt = await models.Receipt.create(newReceipt, { returning: true });

  /** Early exit if saving receipt fails */
  if (!savedReceipt) {
    console.error(`Receipt creation error: ${savedReceipt}`);
    res.json(savedReceipt);
  }

    /** Success case where user is created */
    res.status(200)
      .json({
        message: 'Created receipt successfully.',
        receipt_id: savedReceipt.id
      })
})

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
