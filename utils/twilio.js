
require('dotenv').config();
const Twilio = require('twilio');

const sendText = async (data) => {
  const accountSid = process.env.ACCSID;
  const authToken = process.env.TWILIOTOKEN;
  const txtMessage = `venmo://paycharge?txn=pay&recipients=${data.recipient}&amount=${data.amount}&note=${data.msg}`;

  const client = new Twilio(accountSid, authToken);
  const message = await client.messages.create({
    body: txtMessage,
    to: data.recipient,
    from: '+12345678901',
  });
  return message;
};

module.exports = { sendText };
