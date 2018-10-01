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
const compression = require('compression');
const path = require('path');
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
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(cookieParser());
app.use(express.json());
app.use(verifyAuthentication)
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());

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


// Any remaining  request with an extension (.js, .css, etc...) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
});

// Error handling endware
app.use(( err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

/**************************************************
*  Load Routes
***************************************************/
require('./controllers/signup.js')(app);
require('./controllers/receipt.js')(app);
//require('./controllers/taggun.js')(app);
require('./receipts.js')(app);


// Listen on port number
app.listen(PORT, function () {
    console.log('Check Please listening on port', PORT);
});
