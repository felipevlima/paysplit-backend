require('dotenv').config();
const logger = require('../utils/logger');
const { sendText } = require('./twilio');
const { Invoice, Item, User } = require('../db/models');

/** Find user and return user name */
const getUser = async (data) => {
  const user = await User.find(data.user_id);
  if (!user) {
    logger.error(user);
  }
  return user.firstName;
};

/** Calling database endoipoit to store data */
const storeInvoiceInfo = async (data, firstName) => {
  try {
    // const user = await getUser(data.user_id);
    // console.log(user);
    /** Save invoice and update items in the database */
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
    const sendToTwillio = await sendText(data, firstName);
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
  const getName = await getUser(data);
  const ids = await storeInvoiceInfo(data, getName);
  logger.debug(ids);
  console.log('batch of invoice storage complete');
  return ids;
};

module.exports = { convertInvoice };
