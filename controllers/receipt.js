/* eslint-disable no-console */
const asyncHandler = require('express-async-handler');
const { Router } = require('express');
const models = require('../db/models');
const { convertReceipt } = require('../utils/conversion.js');

const router = Router();

/** Mobile endpoint to retrieve data */
router.post('/api/img', async (req, res) => {
  try {
    const receiptID = await convertReceipt(req.body.url, req.body.user_id);
    return res.status(200).json({
      message: 'Image received successfully',
      receipt_id: receiptID,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something has gone wrong! Please try again.',
    });
  }
});

/** Retrieve all items ever scanned */
router.get('/api/records', async (req, res) => {
  const everyItemEverPurchased = await models.Receipt.findAll();
  res.status(200).json(everyItemEverPurchased);
});

/** Create Items */
router.post('/items', asyncHandler(async (req, res) => {
  const Items = await models.Item.bulkCreate(req.body, { returning: true });
  if (Items.length === 0) {
    return res.status(500).send('no entries returned');
  }
  return res.status(201).json(req.body);
}));

/** Create Receipt */
router.post('/records', async (req, res) => {
  const newReceipt = req.body;
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
      receipt_id: savedReceipt.id,
    });
});

router.put('/:id/edit', (req, res) => {
  models.Receipt.update(req.params.id)
    .then((receipt) => {
      res.status(200).json({ receipt });
      console.log(`Update successfully: ${receipt}`);
    }).catch((err) => {
      if (err) res.status(400).json({ msg: 'ERROR could not update.' });
    });
});

/** GET Receipt Marchant details */
router.get('/:id', (req, res) => {
  models.Receipt.find({ where: { id: req.body.id } })
    .then(receipt => res.status(200).json(receipt))
    .catch(() => res.status(400).json({ msg: 'Error, something went wrong...' }));
});

/** GET Items product details */
router.get('/item/:receipt_id', (req, res) => {
  models.Item.findAll({ where: { receipt_id: req.params.receipt_id } })
    .then(items => res.status(200).json(items))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ mgs: 'Error, something when wrong!' });
    });
});

/** Delete Receipt */
router.delete('/:id', asyncHandler(async (req, res) => {
  await models.Receipt.destroy({
    where: { id: req.params.id },
  });
  return res.status(204);
}));

module.exports = router;
