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

  /** Processing receipt data and Parsing Merchant Details  */
  const processReceiptData = (receipt, user_key, receiptURL) => {
    console.log('processing receipt')
     //generate receipt array for bulk creation
    let RecId = uuidv1();
    for (let item of receipt.numbers) {

      let itemsArr = {
        id: RecId,
        user_id: user_key,
        merchant: receipt.merchantName.data,
        location: receipt.numbers[0].text + " " + receipt.numbers[1].text + " " + receipt.numbers[2].text,
        url: receiptURL
      }
      console.log('Process Data: ', itemsArr)
      return itemsArr
     }

    return itemsArr
  }

  /** Processing receipt data and Parsing Purchase Details  */
  const processItemData = (receipt, receipt_id) => {
    console.log('processing items')
     //generate receipt array for bulk creation
    const Items = []
    receiptId = receipt_id
    for (let item of receipt.lineAmounts) {
=======
// const receiptURLs = {
// traderJoe1: 'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
//  kroger1: 'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
//  foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
//  fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
//  traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',
//
// }


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

const processItemData = (receipt, receiptId) => {
  console.log('processing items');
>>>>>>> develop

  // generate receipt array for bulk creation
  const Items = receipt.amounts.map((item) => {
    console.log('Item: ', item);
    const product = item.text.slice(0, -5);
    if (product.length > 2) {
      return {
        receipt_id: receiptId,
        product,
        price: +item.data,
<<<<<<< HEAD
      }
      if (data.product.length > 2)Items.push(data)
     }
    console.log('Process Data: ', Items)
    return Items
  }

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
      };
    }
    return false; /** Don't add this item to the list */
  });
  console.log('Process Data: ', Items);
  return Items;
};

const storeReceiptDataFromURL = async (receiptURL, userKey) => {
  // const dbReq = axios.create({
  //   baseURL: 'http://localhost:8080',
  // });
  // console.log('User ID: ', user_key);
  console.log('YOOOO', receiptURL);
  try {
    const receipt = await convertReceiptFromURL(receiptURL);
    const receiptArr = processReceiptData(receipt, userKey, receiptURL);
    const receiptId = receiptArr.id;
    const itemsArr = processItemData(receipt, receiptId);
    // console.log('RECEIPT Items: ', itemsArr);
    console.log('storing receipt');
    // const storedReceipt = await dbReq.post('/', receiptArr)
    // const storedItems = await dbReq.post('/', itemsArr)
    // return storedReceipt.data, storedItems.data
    // console.log('receipt stored', storedReceipt.data)
    // console.log('items stored', storedItems.data)
  } catch (err) {
    console.log(err.message);
>>>>>>> develop
  }
};

const runapp = async (url, userId) => {
  // for (let receiptURL of Object.keys(urlArr)) {
  // let url = urlArr
  // let user_token = url.userToken
  // console.log('Token', user_token);
  await storeReceiptDataFromURL(url, userId);
  // }
  console.log('batch receipt storage complete');
};

module.exports = { runapp };
