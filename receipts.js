const axios = require('axios');
const {convertReceiptFromURL} = require('./controllers/taggun');
const models = require('./db/models');

module.exports = function(app) {
  const receiptURLs = {
    traderJoe1:
      'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
    kroger1:
       'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
     foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
    fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
    traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',

  }


  const processReceiptData = (receipt) => {
    console.log('processing receipt')

    //get merchant name
    const summary = receipt.text.text.toLowerCase()
    // console.log("RECEIPT" , receipt)
    let merchant = ''
    const textArr = summary.split('\n')
    const firstword = textArr[0].split(' ')[0] //find the firstword in the text (as opposed to first sentence)

    //generate receipt array for bulk creation
    const itemsArr = []
    console.log(receipt);
    for (let item of receipt.amounts) {
      let entry = {
        merchant: receipt.merchantName.data,
        product: item.text.slice(0, -5),
        price: +item.data,
        date: Date.now(),
        location: receipt.numbers[0].text + " " + receipt.numbers[1].text + " " + receipt.numbers[2].text
      }
      if (entry.product.length > 2) itemsArr.push(entry)
    }
    console.log('receipt processed'/*, itemsArr*/)
    return itemsArr
  }

  const storeReceiptDataFromURL = async(receiptURL, ocrFunc, processingFunc) => {
    const dbReq = axios.create({
      baseURL: 'http://localhost:8080'
    })
    try {
      const receipt = await ocrFunc(receiptURL)
      const receiptArr = processingFunc(receipt)
      console.log('storing receipt')
      const storedReceipt = await dbReq.post('/', receiptArr)
      //console.log('receipt stored',storedReceipt.data)
    } catch (err) {
      console.log("ERROR: ",err)
    }
  }

  const runapp = async urlArr => {
    for (let receiptURL of Object.keys(urlArr)) {
      await storeReceiptDataFromURL(urlArr[receiptURL], convertReceiptFromURL, processReceiptData)
    }
    console.log('batch receipt storage complete')
  }

  runapp(receiptURLs)
}
