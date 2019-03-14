
require('dotenv').config();
const Twilio = require('twilio');

/** Calling Twillio API to text recipients */
const sendText = async (data, userInfo) => {
  const accountSid = process.env.ACCSID;
  const authToken = process.env.TWILIOTOKEN;
  const convertToDecimal = parseFloat(data.amount).toFixed(2);
  const convertMsg = encodeURIComponent(data.msg);
  const url = `venmo://paycharge?txn=pay&recipients=${userInfo.phoneNumber}&amount=${convertToDecimal}&note=${convertMsg}`;
  const txtMessage = `Hi, ${userInfo.firstName} requested ${convertToDecimal} via PaySplit  ${url}`;

  const client = new Twilio(accountSid, authToken);
  const message = await client.messages.create({
    body: txtMessage,
    to: data.recipient,
    from: process.env.PRIVATEPHONE,
  });
  return message;
};

module.exports = { sendText };
