const axios = require('axios');
const {convertReceiptFromURL} = require('./controllers/taggun');
const models = require('./db/models');
const {userToken} = require('./controllers/receipt');

  //const receiptURLs = {
  //  traderJoe1:
      //'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
  //  kroger1:
       //'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
    // foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
  //  fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
  //   traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',
  //
  // }


  const processReceiptData = (receipt, user_key) => {
    console.log('processing receipt')
    //console.log('User ID: ', user_key)
    console.log('RECEIPT', receipt);

     //generate receipt array for bulk creation
    const itemsArr = []
    //console.log(receipt);
    for (let item of receipt.amounts) {
      let entry = {
        merchant: receipt.merchantName.data,
        product: item.text.slice(0, -5),
        price: +item.data,
        date: Date.now(),
        location: receipt.numbers[0].text + " " + receipt.numbers[1].text + " " + receipt.numbers[2].text,
        user_id: user_key
      }

      if (entry.product.length > 2)itemsArr.push(entry)
     }
    //console.log('receipt processed' itemsArr)
    return itemsArr
  }

  const storeReceiptDataFromURL = async (receiptURL, ocrFunc, processingFunc, user_key) => {
    const dbReq = axios.create({
      baseURL: 'http://localhost:8080'
    })
    // console.log('User ID: ', user_key);
    try {
      const receipt = await ocrFunc(receiptURL)
      var receiptArr = processingFunc(receipt, user_key)
      console.log(receipt);
      console.log('storing receipt')
      const storedReceipt = await dbReq.post('/', receiptArr)
      return storedReceipt.data
      console.log('receipt stored',storedReceipt.data)
    } catch (err) {
      console.log("ERROR: ",err)
    }
  }

  const runapp = async (urlArr, user_ID) => {
    for (let receiptURL of Object.keys(urlArr)) {
      let user_key = user_ID
      await storeReceiptDataFromURL(urlArr[receiptURL], convertReceiptFromURL, processReceiptData, user_key)
    }
    console.log('batch receipt storage complete')
  }


  //runapp(receiptURLs)

module.exports = {runapp}
