require('dotenv').config();
const logger = require('../utils/logger');
const { sendText } = require('./twilio');
const { Invoice, Item, User } = require('../db/models');

/**
 * getUser will find the user by id
 * and return the user first name to be send to the Twilio message
 * to clarify who is the person requesting the split.
 * @param {uuid} data - user id information
 */
const getUser = async (data) => {
  const user = await User.find(data.user_id);
  if (!user) {
    logger.error(user);
    return undefined;
  }
  return user.firstName;
};

/** Calling database endoipoit to store data */
const storeInvoiceInfo = async (data, firstName) => {
  try {
    /** creates the invoice in the database */
    const invoice = await Invoice.create({
      receipt_id: data.receipt_id,
      recipient: data.recipient,
      amount: data.amount,
    },
    { returning: true });

    /**
     * Updates the items table storing the invoiceId of each given item.
     */
    const item = await Item.update(
      { invoice_id: invoice.id },
      { where: { receipt_id: data.receipt_id } },
      { returning: true },
    );

    /**
     * Send the data to the twilio api to send invoice request to recipient
     */
    const sendToTwillio = await sendText(data, firstName);
    console.log(sendToTwillio);

    return {
      invoice_id: invoice.id,
      item_ids: item.id,
    };
  } catch (err) {
    logger.error(err);
    return undefined;
  }
};

/** Transport data received */
const transportInvoice = async (data) => {
  logger.info(data);

  /** Search for the user first name and returns to storeInvoiceInfo */
  const getUsername = await getUser(data);

  /** Store data in the database. */
  const invoiceIds = await storeInvoiceInfo(data, getUsername);
  logger.debug(invoiceIds);

  console.log('batch of invoice storage complete');
  return invoiceIds;
};

module.exports = { transportInvoice };
