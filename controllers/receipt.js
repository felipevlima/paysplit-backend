const { Router } = require('express');
const { Receipt, Item } = require('../db/models');
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

/** Get Receipts and Items  */
router.get('/items/:id', asyncHandler(async (req, res) => {
  const getReceipt = await Receipt.find({ where: { id: req.params.id } });
  if (!getReceipt) {
    logger.error(getReceipt);
    return respondWith(res, 404, ['Could not find requested receipt.']);
  }
  const getItem = await Item.findAll({ where: { receipt_id: req.params.id } });
  if (!getItem) {
    logger.error(getItem);
    return respondWith(res, 404, ['Could not find requested Item']);
  }
  return respondWith(res, 200, ['Returning Receitp and Items founds'], { getReceipt, getItem });
}));

/** Get all receipts by user id */
router.get('/all/:user_id', asyncHandler(async (req, res) => {
  const getAllReceipts = await Receipt.findAll({
    where: { user_id: req.params.user_id },
    returning: true,
  });
  if (!getAllReceipts) {
    logger.error(getAllReceipts);
    return respondWith(res, 404, ['Could not find any receipt']);
  }
  return respondWith(res, 200, ['All user receipts found'], { getAllReceipts });
}));

/** Delete Receipt */
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await Receipt.destroy({ where: { id: req.params.id } });
  if (!result) {
    logger.error(result);
    respondWith(res, 404, ['Could not find requested receipt.']);
  }
  return respondWith(res, 204, ['Receipt was successfully deleted.'], { result });
}));

module.exports = router;
