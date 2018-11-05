require('dotenv').config();
const logger = require('../utils/logger');
const { sendText } = require('./twilio');
const { Invoice, Item } = require('../db/models');

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
    const sendToTwillio = await sendText(data);
    return {
      invoice_id: invoice.id,
      item_ids: item.id,
      sendToTwillio,
    };
  } catch (err) {
    logger.error(err);
    return undefined;
  }
};

/** Converting invoices */
const convertInvoice = async (data) => {
  logger.info(data);
  const ids = await storeInvoiceInfo(data);
  logger.debug(ids);
  console.log('batch of invoice storage complete');
  return ids;
};

module.exports = { convertInvoice };
