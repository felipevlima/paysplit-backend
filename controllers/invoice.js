/** Check Please - Signup Rotuer */
const { Router } = require('express');
const { Invoice, Item } = require('../db/models');
const { convertInvoice } = require('../utils/InvoiceConversion');
const { asyncHandler } = require('../utils/asyncRouteHandler');

const logger = require('../utils/logger');
const { respondWith } = require('../utils/clientResponse');

const router = Router();

/** Mobile endpoint to retrieve data  */
router.post('/smsconvert', asyncHandler(async (req, res) => {
  const test = {
    receipt_id: req.body.receipt_id,
    amount: req.body.amount,
    recipient: req.body.recipient,
    msg: req.body.msg,
  };
  const data = await convertInvoice(test);
  if (!data) {
    logger.error(data);
    return respondWith(res, 500, ['An error occured while converting the invoice.']);
  }
  return respondWith(res, 200, 'Invoice received successfully.', data);
}));

/** Retrieve every Invoice stored */
router.get('/records', asyncHandler(async (req, res) => {
  const allInvoices = await Invoice.findAll();
  return respondWith(res, 200, ['Retruning all receipts.'], { allInvoices });
}));

/** GET Invoices details */
router.get('/:id', asyncHandler(async (req, res) => {
  const invoice = await Invoice.find({ where: { id: req.body.id } });
  if (!invoice) {
    return respondWith(res, 404, ['Could not find requested invoice.']);
  }
  return respondWith(res, 200, ['Returning found invoice.'], { invoice });
}));

/** GET Items invoice details */
router.get('/item/:invoice_id', asyncHandler(async (req, res) => {
  const items = await Item.findAll({ where: { invoice_id: req.params.invoice_id } });

  /** If no items found, likely internal server error */
  if (!items) {
    logger.error(items);
    const errMsg = 'Somethign went wrong fetching all items. Try again!';
    return respondWith(res, 500, [errMsg]);
  }
  return respondWith(res, 200, ['Returning all found items'], { items });
}));

/** Delete Invoice  */
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await Invoice.destroy({ where: { id: req.params.id } });
  return respondWith(res, 204, ['Invoice was successfuly deleted.'], { result });
}));

module.exports = router;
