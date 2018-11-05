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
    return respondWith(res, 500, ['An error occured while converting the invoice.']);
  }
  return respondWith(res, 200, 'Invoice received successfully.', data);
}));

// router.post('/sms', async (req, res) => {
//   const data = {
//     receipt_id: req.body.receipt_id,
//     amount: req.body.amount,
//     recipient: req.body.recipient,
//     msg: req.body.msg,
//   };
//   console.log(data);
//   const invoiceRecord = await convertInvoice(data);
//   console.log(invoiceRecord);
//   return res.status(200).json({
//     message: 'Invoice received successfully',
//     invoice_id: invoiceRecord,
//   });
// });

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


/** Create Invoice */
router.post('/create', async (req, res) => {
  const newInvoice = {
    receipt_id: req.body.receipt_id,
    recipient: req.body.recipient,
    amount: req.body.amount,
  };
  const savedInv = await Invoice.create(newInvoice, { returning: true });
  if (!savedInv) {
    return respondWith(res, 500, ['An error occured during the creation of the invoice']);
  }
  /** Success case where user is created */
  return res.status(200)
    .json({
      message: 'Created receipt successfully.',
      invoice_id: savedInv.id,
      receipt_id: savedInv.receipt_id,
    });
});

/** Update Items to add invoice id */
router.patch('/update/bulk', (req, res) => {
  const id = req.body.receipt_id;
  const invoice = req.body.invoice_id;
  Item.update(
    { invoice_id: invoice },
    { where: { receipt_id: id } },
  )
    .then((updatedRows) => {
      res.json(updatedRows);
    })
    .catch((err) => {
      logger.error(err);
    });
});

module.exports = router;
