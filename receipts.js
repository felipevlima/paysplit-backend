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
    let merchant = ''
    const storeNameMap = {foodtown: 'Foodtown', kroger: 'Kroger', trader: 'Trader Joe\'s', fairway: 'Fairway'}
    const textArr = summary.split('\n')
    const firstword = textArr[0].split(' ')[0] //find the firstword in the text (as opposed to first sentence)

    if (storeNameMap[firstword]) {
      merchant = storeNameMap[firstword]
    } else {
      for (let store of Object.keys(storeNameMap)) {
        if (summary.includes(store)) {
          merchant = storeNameMap[store]
          break;
        } else {
          merchant = 'no name found'
        }
      }
    }

    //generate receipt array for bulk creation
    const itemsArr = []
    for (let item of receipt.amounts) {
      let entry = {
        merchant: merchant,
        product: item.text.slice(0, -5),
        price: +item.data,
        date: /*receipt.date.data ||*/ null
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
      //models.Receipt.create(receiptArr, {w:1}).then((savedReceipt) => {
       //await models.Receipt.bulkCreate((receiptArr) => {
      //   return res.status(200).send({message: 'Stored in the database successfully'})
      // })
      console.log('receipt stored',storedReceipt.data)
    } catch (err) {
      console.log("OPPS",err)
    }
  }
  //storeReceiptDataFromURL(receiptURLs.traderJoe2,  convertReceiptFromURL, processReceiptData)

  const runapp = async urlArr => {
    for (let receiptURL of Object.keys(urlArr)) {
      await storeReceiptDataFromURL(urlArr[receiptURL], convertReceiptFromURL, processReceiptData)
    }
    console.log('batch receipt storage complete')
  }

  runapp(receiptURLs)
}
