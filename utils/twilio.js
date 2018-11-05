
require('dotenv').config();
const Twilio = require('twilio');

/** Calling Twillio API to text recipients */
const sendText = async (data, name) => {
  const firstName = name;
  const accountSid = process.env.ACCSID;
  const authToken = process.env.TWILIOTOKEN;
  const convertToDecimal = parseFloat(data.amount).toFixed(2);
  const convertMsg = encodeURIComponent(data.msg);
  const txtMessage = `Hello, ${firstName} requested ${convertToDecimal} via PaySplit  venmo://paycharge?txn=pay&recipients=${data.recipient}&amount=${convertToDecimal}&note=${convertMsg}`;

  const client = new Twilio(accountSid, authToken);
  const message = await client.messages.create({
    body: txtMessage,
    to: data.recipient,
    from: '+14159149382',
  });
  return message;
};

module.exports = { sendText };
