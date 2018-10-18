/* eslint-disable no-console */
const axios = require('axios');
const uuidv1 = require('uuid/v1');
const { convertReceiptFromURL } = require('../controllers/taggun');

<<<<<<< HEAD

  /** const receiptURLs = {
   traderJoe1: 'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
   kroger1: 'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
   foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
   fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
   traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',
 } */
=======
/** const receiptURLs = {
 traderJoe1: 'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
  kroger1: 'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
  foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
  fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
  traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',
} */
>>>>>>> Update formatting to adhere to AirBnB style guide


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


<<<<<<< HEAD
  /** Calling database endpoint to store data */
  const storeReceiptDataFromURL = async (receiptURL, ocrFunc, processingFunc, user_key) => {
    const dbReq = axios.create({
      baseURL: 'http://localhost:8080'
    })
    try {
      const receipt = await ocrFunc(receiptURL)
      let receiptArr = processingFunc(receipt, user_key, receiptURL)
      let receipt_id = receiptArr.id
      let itemsArr = processItemData(receipt, receipt_id)
      console.log('storing receipt')
      const storedReceipt = await dbReq.post('/receipt/records', receiptArr)
      const storedItems = await dbReq.post('/receipt/items', itemsArr)
      console.log('receipt stored', storedReceipt.data)
      console.log('items stored', storedItems.data)
      return storedReceipt.data, storedItems.data
    } catch (err) {
      console.log(err.message)
    }
  }
  /** Transport data received */
  const runapp = async (url, user_ID) => {
      let user_key = user_ID
      await storeReceiptDataFromURL(url, convertReceiptFromURL, processReceiptData, user_key)
    console.log('batch receipt storage complete')
=======
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
>>>>>>> Update formatting to adhere to AirBnB style guide
};

/** Transport data received */
const convertReceipt = async (url, userID) => {
  await storeReceiptDataFromURL(url, userID);
  console.log('batch receipt storage complete');
};

module.exports = { convertReceipt };
