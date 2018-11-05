
require('dotenv').config();
const Twilio = require('twilio');

/** Calling Twillio API to text recipients */
const sendText = async (data) => {
  const accountSid = process.env.ACCSID;
  const authToken = process.env.TWILIOTOKEN;
  const convertToDecimal = parseFloat(data.amount).toFixed(2);
  const convertMsg = encodeURIComponent(data.msg);
  const txtMessage = `venmo://paycharge?txn=pay&recipients=${data.recipient}&amount=${convertToDecimal}&note=${convertMsg}`;

  const client = new Twilio(accountSid, authToken);
  const message = await client.messages.create({
    body: txtMessage,
    to: data.recipient,
    from: '+18573052984',
  });
  return message;
};

module.exports = { sendText };
