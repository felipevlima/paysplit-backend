const { Router } = require('express');
const { Item, Receipt } = require('../db/models');
const { convertReceipt } = require('../utils/conversion.js');
const { respondWith } = require('../utils/clientResponse');
const logger = require('../utils/logger');
const { asyncHandler } = require('../utils/asyncRouteHandler');

const router = Router();

/** Mobile endpoint to retrieve data */
router.post('/api/img', asyncHandler(async (req, res) => {
  const receiptID = await convertReceipt(req.body.url, req.body.user_id);
  return respondWith(res, 200, ['Image received successfully.'], {
    receipt_id: receiptID,
  });
}));

/** Retrieve all items ever scanned */
router.get('/api/records', asyncHandler(async (req, res) => {
  const allReceipts = await Receipt.findAll();
  return respondWith(res, 200, ['Returning all receipts.'], { allReceipts });
}));

/** Create Items */
router.post('/items', asyncHandler(async (req, res) => {
  const items = await Item.bulkCreate(req.body, { returning: true });
  /** Check if items found */
  if (items.length === 0) return respondWith(res, 500);

  const itemIDs = items.map(item => item.id);
  return respondWith(res, 201, ['All items created!'], { itemIDs });
}));

/** Create Receipt */
router.post('/records', asyncHandler(async (req, res) => {
  const savedReceipt = await Receipt.create(req.body, { returning: true });

  /** Early exit if saving receipt fails */
  if (!savedReceipt) {
    logger.error(`Receipt creation error: ${savedReceipt}`);
    return respondWith(res, 500);
  }

  /** Success case where user is created */
  return respondWith(res, 200, ['Created receipt successfully.'], { receipt_id: savedReceipt.id });
}));

/** GET Receipt Marchant details */
router.get('/:id', asyncHandler(async (req, res) => {
  const receipt = await Receipt.find({ where: { id: req.body.id } });
  if (!receipt) {
    return respondWith(res, 404, ['Could not find requested receipt.']);
  }

  return respondWith(res, 200, ['Returning found receipt'], { receipt });
}));

/** GET Items product details */
router.get('/item/:receipt_id', asyncHandler(async (req, res) => {
  const items = await Item.findAll({ where: { receipt_id: req.params.receipt_id } });
  /** If no items found, likely something went wrong internally */
  if (!items) {
    const msg = 'Something went wrong fetching all items. Please try your search again.';
    return respondWith(res, 500, [msg]);
  }

  return respondWith(res, 200, ['Returning all found items'], { items });
}));

/** Delete Receipt */
router.delete('/:id', asyncHandler(async (req, res) => {
  /** TODO: find out what is returned by the destroy function */
  const result = await Receipt.destroy({ where: { id: req.params.id } });
  return respondWith(res, 204, ['Receipt was successfully deleted.']);
}));

module.exports = router;
