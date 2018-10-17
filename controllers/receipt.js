/* eslint-disable no-console */
const asyncHandler = require('express-async-handler');
const { Router } = require('express');
const models = require('../db/models');
const { runapp } = require('../utils/receipts.js');
const { convertReceiptFromURL } = require('./taggun.js');

const router = Router();

 /** Mobile endpoint to retrieve data */
router.post('/api/img', (req, res) => {
  runapp(req.body.url, req.body.user_id);
  res.status(200).json({ message: 'Image received successfully' });
});

/** Retrieve all items ever scanned */
router.get('/all/records', async (req, res) => {
  const everyItemEverPurchased = await models.Receipt.findAll();
  res.json(everyItemEverPurchased);
});

/** Create Items */
router.post('/items', asyncHandler(async (req, res) => {
  const Items = await models.Item.bulkCreate(req.body, { returning: true });
  if (Items.length === 0) {
    return res.send('no entries returned').status(500)
  }
  res.status(201).json(req.body);
}));

/** Create Receipt */
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

/** GET Receipt Marchant details */
router.get('/:id', (req, res) => {
  const id = req.params.id;
  models.Receipt.find({
    where: { id: id, user_id: id }
  })
  .then(Receipt => {
    res.status(200)
    .json(Receipt)
  })
  .catch((err) => {
    if (err) {
      res.status(400)
      .json({msg: 'Error, something went wrong...'})
    }
  })
});

router.delete('/:id', asyncHandler(async (req, res) => {
  await models.Receipt.destroy({
    where: { id: req.params.id },
  });
  res.status(204);
}));

module.exports = router;
