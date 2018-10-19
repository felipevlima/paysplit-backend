/* eslint-disable no-console */
const axios = require('axios');
const uuidv1 = require('uuid/v1');
const logger = require('../utils/logger');

/** const receiptURLs = {
 traderJoe1: 'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
  kroger1: 'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
  foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
  fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
  traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',
} */

/** Taggun API setup */
const formData = url => ({
  url,
  headers: {
    'x-custom-key': 'string',
  },
  refresh: false,
  incognito: false,
  ipAddress: '32.4.2.223',
  language: 'en',
});

const convertReceiptFromURL = async (url) => {
  logger.log('converting receipt');
  const taggun = axios.create({
    baseURL: 'https://api.taggun.io/api/',
    headers: { apikey: process.env.TAGKEY },
  });
  const body = formData(url);

  try {
    const response = await taggun.post('/receipt/v1/verbose/url', body);
    const dataObj = response.data;
    // console.log('receipt converted', dataObj)
    return dataObj;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

/** Processing receipt data and Parsing Merchant Details  */
const processReceiptData = (receipt, userKey, receiptURL) => {
  console.log('processing receipt');
  const receiptId = uuidv1();
  const fullLocation = receipt.numbers.reduce((acc, cur, idx) => {
    if (idx < 3) return `${acc}${cur.text} `;

    return acc;
  });
  const data = {
    id: receiptId,
    user_id: userKey,
    merchant: receipt.merchantName.data,
    location: fullLocation,
    url: receiptURL,
  };
  return data;
};

/** Processing receipt data and Parsing Purchase Details  */
const processItemData = (receipt, receiptId) => {
  console.log('processing items');

  // generate receipt array for bulk creation
  const Items = receipt.amounts.map((item) => {
    console.log('Item: ', item);
    const product = item.text.slice(0, -5);
    if (product.length > 2) {
      return {
        receipt_id: receiptId,
        product,
        price: +item.data,
      };
    }
    return false; /** Don't add this item to the list */
  });
  console.log('Process Data: ', Items);
  return Items;
};


/** Calling database endpoint to store data */
const storeReceiptDataFromURL = async (receiptURL, userKey) => {
  const dbReq = axios.create({
    baseURL: 'http://localhost:8080',
  });
  try {
    const receipt = await convertReceiptFromURL(receiptURL);
    const receiptArr = processReceiptData(receipt, userKey, receiptURL);
    const receiptID = receiptArr.id;
    const itemsArr = processItemData(receipt, receiptID);
    console.log('storing receipt');
    const storedReceipt = await dbReq.post('/receipt/records', receiptArr);
    const storedItems = await dbReq.post('/receipt/items', itemsArr);
    console.log('receipt stored', storedReceipt.data);
    console.log('items stored', storedItems.data);
    return storedReceipt.id;
  } catch (err) {
    console.log(err.message);
    return new Error(err.message);
  }
};

/** Transport data received */
const convertReceipt = async (url, userID) => {
  await storeReceiptDataFromURL(url, userID);
  console.log('batch receipt storage complete');
};

module.exports = { convertReceipt };
