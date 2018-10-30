
require('dotenv').config();
const twilio = require('twilio');
const axios = require('axios');


const sendText = async (data) => {
  const accountSid = process.env.ACCSID;
  const authToken = process.env.TWILIOTOKEN;
  const txtMessage = `venmo://paycharge?txn=pay&recipients=${data.recipient}&amount=${data.amount}&note=${data.msg}`;

  const client = new twilio(accountSid, authToken);
  const message = await client.messages.create({
    body: txtMessage,
    to: data.recipient,
    from: '+12345678901',
  });
  return message;
};

const createInvoice = async (invoice) => {
  const dbRequest = axios.create({
    baseURL: 'http://localhost:8080',
  });
  try {
    const storeInvoice = await dbRequest.post('/invoice/create', invoice);
    console.log('STORE INVOICE', storeInvoice);
    const updateItems = await dbRequest.post('/update/bulk', storeInvoice.id, storeInvoice.receipt_id);
    const createText = await sendText(invoice);
    console.log('UPDATED ITEMS: ', updateItems);
    console.log('TEXT: ', createText);
    return storeInvoice.id;
  } catch (err) {
    console.log(err.message);
    return new Error(err.message);
  }
};

const convertInvoice = async (data) => {
  // console.log('HERE', data);
  await createInvoice(data);
  console.log('batch of invoice storage complete');
};

module.exports = { convertInvoice };
