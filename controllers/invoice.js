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
// router.post('/create', async (req, res) => {
//   const newInvoice = req.body;
//   console.log('NEW INVOICE', newInvoice);
//   const savedInvoice = await models.Invoice.create(newInvoice, { returning: true });
//   console.log('SAVED ', savedInvoice);
//   /** Exit if saving invoice fails */
//   // if (!savedInvoice) {
//   //   console.error(`Invoice creation error: ${savedInvoice}`);
//   //   res.json(savedInvoice);
//   // }

//   /** Success case where invoices is created */
//   res.status(200)
//     .json({
//       message: 'Created receipt successfully.',
//       invoice_id: savedInvoice.id,
//     });
// });


router.post('/test', async (req, res) => {
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
      receipt_id: savedInv.id,
    });
});

/** Update Items to add invoice id */
router.patch('/update/bulk', (req, res) => {
  models.Item.findAll({
    where: { id: { $in: req.body.ids } },
  })
    .then(((Items) => {
      const updatePromises = Items.map(Item => Item.updateAttributes(req.body.invoice_id));

      const updatedItems = models.Sequelize.Promise.all(updatePromises);
      return updatedItems;
    })
      .then((updatedItems) => {
        res.status(200)
          .json(updatedItems);
      }))
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
