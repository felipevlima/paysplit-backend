/** Check Please - Signup Rotuer */
const { Router } = require('express');
const { Invoice, Item } = require('../db/models');
const { transportInvoice } = require('../utils/InvoiceConversion');
const { asyncHandler } = require('../utils/asyncRouteHandler');

const logger = require('../utils/logger');
const { respondWith } = require('../utils/clientResponse');

const router = Router();

/** Mobile endpoint to retrieve data  */
router.post('/smsconvert', asyncHandler(async (req, res) => {
  const invoiceData = {
    receipt_id: req.body.receipt_id,
    amount: req.body.amount,
    recipient: req.body.recipient,
    msg: req.body.msg,
  };
  const data = await transportInvoice(invoiceData);
  if (!data) {
    logger.error(data);
    return respondWith(res, 500, ['An error occured while converting the invoice.']);
  }
  return respondWith(res, 200, 'Invoice received successfully.', data);
}));

/** Retrieve every Invoice stored */
router.get('/all/records', asyncHandler(async (req, res) => {
  const allInvoices = await Invoice.findAll();
  return respondWith(res, 200, ['Retruning all invoices.'], { allInvoices });
}));

/** GET Invoices details */
router.get('/:id', asyncHandler(async (req, res) => {
  const invoice = await Invoice.find({ where: { id: req.params.id } });
  if (!invoice) {
    return respondWith(res, 404, ['Could not find requested invoice.']);
  }
  return respondWith(res, 200, ['Returning found invoice.'], { invoice });
}));

/** Delete Invoice  */
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await Invoice.destroy({ where: { id: req.params.id } });
  return respondWith(res, 204, ['Invoice was successfuly deleted.'], { result });
}));

module.exports = router;
