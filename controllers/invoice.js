/** Check Please - Signup Rotuer */
const { Router } = require('express');
const models = require('../db/models');
const { convertInvoice } = require('../utils/twilio');

const router = Router();
// receives data from app
router.post('/sms', async (req, res) => {
  const data = {
    receipt_id: req.body.receipt_id,
    amount: req.body.amount,
    recipient: req.body.recipient,
    msg: req.body.msg,
  };
  console.log(data);
  const invoiceRecord = await convertInvoice(data);
  console.log(invoiceRecord);
  return res.status(200).json({
    message: 'Invoice received successfully',
    invoice_id: invoiceRecord,
  });
});

/** Create Invoice */
router.post('/create', async (req, res) => {
  const newInvoice = {
    receipt_id: req.body.receipt_id,
    recipient: req.body.recipient,
    amount: req.body.amount,
  };
  const savedInv = await models.Invoice.create(newInvoice, { returning: true });
  if (!savedInv) {
    console.error(`Invoice creation error: ${savedInv}`);
    res.json(savedInv);
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
  models.Item.update(
    { invoice_id: invoice },
    { where: { receipt_id: id } },
  )
    .then((updatedRows) => {
      res.json(updatedRows);
    })
    .catch((err) => {
      console.log('An error occured', err);
    });
});

module.exports = router;
