const { Router } = require('express');
const { Item, Receipt } = require('../db/models');
const { convertReceipt } = require('../utils/conversion.js');
const { respondWith } = require('../utils/clientResponse');
const logger = require('../utils/logger');
const { asyncHandler } = require('../utils/asyncRouteHandler');

const router = Router();
/** Mobile endpoint to retrieve data */
router.post('/conversion', asyncHandler(async (req, res) => {
  const data = await convertReceipt(req.body.url, req.body.user_id);

  if (data === undefined) {
    return respondWith(res, 500, ['An error occurred while converting the receipt.']);
  }

  return respondWith(res, 200, ['Image received successfully.'], data);
}));

/** Retrieve all items ever scanned */
router.get('/all/records', asyncHandler(async (req, res) => {
  const allReceipts = await Receipt.findAll();
  if (!allReceipts) {
    logger.error(allReceipts);
    return respondWith(res, 500, ['An error occurred while attempting to get all receipts.']);
  }
  return respondWith(res, 200, ['Returning all receipts.'], { allReceipts });
}));

/** GET Receipt Marchant details */
router.get('/:id', asyncHandler(async (req, res) => {
  const receipt = await Receipt.find({ where: { id: req.params.id } });
  if (!receipt) {
    return respondWith(res, 404, ['Could not find requested receipt.']);
  }

  return respondWith(res, 200, ['Returning found receipt'], { receipt });
}));

/** Delete Receipt */
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await Receipt.destroy({ where: { id: req.params.id } });
  return respondWith(res, 204, ['Receipt was successfully deleted.'], { result });
}));

module.exports = router;
