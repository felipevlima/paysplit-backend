/****************************************
*   Check-Please main server
****************************************/

require('dotenv').config()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const {convertingReceiptFromURL} = require('./controllers/taggun');


//Instantiate the server
const app = express();

const PORT = process.env.PORT || 3000;

/****************************************************
 *  Check for login token on every request
 ***************************************************/
let verifyAuthentication = (req, res, next) => {
    if (typeof req.cookies.jwtToken === 'undefined' || req.cookies.jwtToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.jwtToken;

      //Synchronous verification
      try{
        decodedToken = jwt.verify(token, process.env.SECRETKEY);
        //console.log("***Authenticate***");
        req.user = decodedToken.id;
      }catch(err){
        console.log("Authentication Error:", err.message);
      };
    };
    next();
  };

let verifyUserLoggedIn = (req, res)=>{
    if(!req.user){
        res.redirect("/");
    };
    next();
};

/**************************************************
*  Middlewarez
***************************************************/

 // Set up a static public directory
app.use(express.static('./public'))
app.use(cookieParser());
app.use(express.json());
app.use(verifyAuthentication)
app.use(bodyParser.urlencoded({extended: true}));

/***************************************************
 *  SQL Connection
 ***************************************************/
const Sequelize = require('sequelize');
const sequelize = new Sequelize('check-please', process.env.DBUSER, null, { dialect: 'postgres', logging: false });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.message);
  });

/****************************************************
*   TAGGUN
****************************************************/
const receiptURLS = {
  traderJoe1: 'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
  kroger1: 'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
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
  const firstword = textArr[0].split(' ')[0]

  if (storeNameMap[firstword]) {
    merchant = storeNameMap[firstword]
  } else {
    for (let store of Object.keys(storeNameMap)) {
      if (summary.includes(store)) {
        merchant = storeNameMap[store]
        break;
      } else {
        merchant =  'no name found'
      }
    }
  }
  //generate receipt array for bulk creation
  const itemArr = []
  for (let item  of receipt.amounts) {
    let entry = {
      merchant: merchant,
      product: item.text.slice(0, -5),
      price: +item.data,
      data: receipt.date.data //null
    }
    if(entry.product.length > 2) itemArr.push(entry)
  }
  console.log('receipt processed');
  return itemArr
}
const storeReceiptDataFromURL = async(receiptURLS, ocrFunc, processingFunc) = {
  const dbReq = axios.create({
    baseURL: 'http://localhost:8080/api/'
  })
  try {
    const receipt = await ocrFunc(receiptURLS)
    const receiptArr = processingFunc(receipt)
    console.log('storing receipt');
    const storedReceipt = await dbReq.post('/receipts', receiptArr)
    console.log('receipt stored', storedReceipt.data);
  } catch (err) {
    console.log(err)
  }
}
//storeReceiptDataFromURL(receiptURLs.traderJoe2,  convertReceiptFromURL, processReceiptData)

const runapp = async urlArr => {
  for (let receiptURL of Object.keys(urlArr)) {
    await storeReceiptDataFromURL(urlArr[receiptURL], convertReceiptFromURL, processReceiptData)
  }
  console.log('batch receipt storege complete')
}

//runapp(receiptURL)

/**************************************************
*  Load Routes
***************************************************/
require('./controllers/signup.js')(app);


// Listen on port number
app.listen(PORT, function () {
    console.log('Check Please listening on port', PORT);
});
