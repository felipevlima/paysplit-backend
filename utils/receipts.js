const axios = require('axios');
const uuidv1 = require('uuid/v1');
const {convertReceiptFromURL} = require('../controllers/taggun');
const models = require('../db/models');
const {userToken} = require('../controllers/receipt');

  //const receiptURLs = {
  //  traderJoe1: 'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
  //  kroger1: 'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
  //  foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
  //  fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
  //  traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',
  //
  // }


  const processReceiptData = (receipt, user_key, receiptURL) => {
    console.log('processing receipt')
    //console.log('User ID: ', user_key)
     //generate receipt array for bulk creation
    //let itemsArr;
    let RecId = uuidv1();
    //console.log(receipt);
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
     //  if (entry.merchant.length > 2)itemsArr.push(entry)
     //  break;
     }
    //console.log('receipt processed' itemsArr)
    return itemsArr
  }

  const processItemData = (receipt, receipt_id) => {
    console.log('processing items')
    //console.log('User ID: ', user_key)
     //generate receipt array for bulk creation
    const Items = []
    receiptId = receipt_id
    //console.log(receipt);
    for (let item of receipt.lineAmounts) {

      let data = {
        receipt_id: receiptId,
        product: item.text.slice(0, -5),
        price: +item.data,
      }
      if (data.product.length > 2)Items.push(data)
     }
    console.log('Process Data: ', Items)
    return Items
  }

  const storeReceiptDataFromURL = async (receiptURL, ocrFunc, processingFunc, user_key) => {
    const dbReq = axios.create({
      baseURL: 'http://localhost:8080'
    })
    // console.log('User ID: ', user_key);
    console.log('YOOOO', receiptURL);
    try {
      const receipt = await ocrFunc(receiptURL)
      let receiptArr = processingFunc(receipt, user_key, receiptURL)
      let receipt_id = receiptArr.id
      let itemsArr = processItemData(receipt, receipt_id)
      //console.log('RECEIPT Items: ', itemsArr);
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

  const runapp = async (url, user_ID) => {
    // for (let receiptURL of Object.keys(urlArr)) {
      //let url = urlArr
      let user_key = user_ID
      //let user_token = url.userToken
      //console.log('Token', user_token);
      await storeReceiptDataFromURL(url, convertReceiptFromURL, processReceiptData, user_key)
    // }
    console.log('batch receipt storage complete')
  }


  //runapp(receiptURLs)

module.exports = {runapp}
