const axios = require('axios');
const logger = require('../utils/logger');
const { sendText } = require('./twilio');
const { Invoice, Item } = require('../db/models');

// const dbRequest = axios.create({
//   baseURL: 'http://localhost:8080/invoice',
// });

/** Calling database endoipoit to store data */
const storeInvoiceInfo = async (data) => {
  try {
    /** Save invoice and update items in the database */
    console.log(data);
    const invoice = await Invoice.create({
      receipt_id: data.receipt_id,
      recipient: data.recipient,
      amount: data.amount,
    },
    { returning: true });
    const item = await Item.update(
      { invoice_id: invoice.id },
      { where: { receipt_id: data.receipt_id } },
      { returning: true },
    );
    console.log('ITEM', item);
    return {
      invoice_id: invoice.id,
      item_ids: item.id,
    };
  } catch (err) {
    logger.error(err);
    return undefined;
  }
};

// const createInvoice = async (invoice) => {
//   const dbRequest = axios.create({
//     baseURL: 'http://localhost:8080',
//   });
//   try {
//     const storeInvoice = await dbRequest.post('/invoice/create', invoice);
//     // console.log('STORE INVOICE', storeInvoice);
//     const updateItems = await dbRequest.patch('/update/bulk', storeInvoice.id, storeInvoice.receipt_id);
//     console.log('YOOOOO', invoice);
//     const createText = await sendText(invoice);
//     console.log('UPDATED ITEMS: ', updateItems);
//     //console.log('TEXT: ', createText);
//     return storeInvoice.id;
//   } catch (err) {
//     logger.error(err);
//     return undefined;
//   }
// };

const convertInvoice = async (data) => {
  logger.info(data);
  const ids = await storeInvoiceInfo(data);
  logger.debug(ids);
  console.log('batch of invoice storage complete');
  return ids;
};

module.exports = { convertInvoice };
