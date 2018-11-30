/* eslint-disable no-console */
/*
 * Check-Please main server
 */
require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const compression = require('compression');
const path = require('path');
const Sequelize = require('sequelize');
const sanitizer = require('sanitize');
const expressSanitizer = require('express-sanitizer');
const { Client } = require('pg');

/** Import Routes */
const { verifyAuthentication } = require('./utils/middleware');
const indexRouter = require('./controllers/index.js');
const authRouter = require('./controllers/auth.js');
const receiptRouter = require('./controllers/receipt.js');
const invoiceRouter = require('./controllers/invoice.js');
const itemRouter = require('./controllers/item.js');

/** Instantiate the server */
const app = express();
const PORT = process.env.PORT || 3000;

/** Set up static public directory */
app.use(express.static(path.join(__dirname, '..', 'public')));

/** Middlewarez */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(sanitizer.middleware);
app.use(expressSanitizer());

/**  SQL Connection */
const sequelize = new Sequelize(`postgres://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  /** Early exit */
  .catch((err) => {
    console.error('Unable to connect to the database:', err.message);
  });


/** Set up routes */
app.use('/', indexRouter);
app.use('/auth', authRouter);

/** Protected Routes */
app.use(verifyAuthentication);
app.use('/receipts', receiptRouter);
app.use('/invoices', invoiceRouter);
app.use('/items', itemRouter);


/** Any remaining request with an extension (.js, .css, etc...) send 404 */
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  }

  next();
});

app.listen(PORT, () => {
  console.log('PaySplit listening on port', PORT);
});
