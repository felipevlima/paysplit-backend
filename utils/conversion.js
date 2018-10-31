/* eslint-disable no-console */
const axios = require('axios');
const uuidv1 = require('uuid/v1');
const logger = require('../utils/logger');
const sequelize = require('sequelize');
const { Receipt, Item } = require('../db/models');

/** Create the reference to taggun once */
const taggun = axios.create({
  baseURL: 'https://api.taggun.io/api/',
  headers: { apikey: process.env.TAGKEY },
});

/* const receiptURLs = {
 traderJoe1: 'http://4hatsandfrugal.com/wp-content/uploads/2015/06/64-dollar-grocery-budget-trader-joes1.jpg',
  kroger1: 'https://thesaraandmalarishow.files.wordpress.com/2009/03/kroger.jpg',
  foodtown1: 'http://neuseelandbilder.com/en/img/foodtown.gif',
  fairway1: 'https://www.thebillfold.com/wp-content/uploads/2016/05/1zwdpei1DmTW0V5iyPVOB_A.png',
  traderJoe2: 'https://birdfriendsnesthomes.files.wordpress.com/2015/02/fullsizerender_12.jpg',
}
*/

/**
 * Converts the image at the specified url into data that can be used
 * throughout the rest of the project.
 * @param {String} url The url pointing to the image to be processed
 * @returns The raw data returned from the Taggun API or undefined
 */
const convertReceiptImageToRawData = async (url) => {
  logger.info('Coverting receipt from image.');
  try {
    const response = await taggun.post('/receipt/v1/verbose/url', {
      url,
      headers: { 'x-custom-key': 'string' },
      refresh: false,
      incognito: false,
      ipAddress: '32.4.2.223',
      language: 'en',
    });
    return response.data;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};

/**
 * Processes the raw data returned from the Taggun API into data that can be used
 * to create models in the database.
 * @param {JSON} rawData The raw data returned from the Taggun API that needs to
 * be processed
 * @param {String} userId The id of the user who created this receipt
 * @param {String} receiptImageURL The url pointing to the image of the processed receipt
 * @returns An object containingg the processed receipt data and the processed Item data
 */
const processRawData = (rawData, userId, receiptImageURL) => {
  logger.info('Processing raw data into usable data...');

  /** Create a unique id for the receipt */
  const receiptId = uuidv1();

  /** Process receipt data */
  const fullLocation = rawData.numbers.reduce((acc, cur, idx) => {
    if (idx < 3) return `${acc}${cur.text}, `;
    return acc;
  }, '');
  const receiptData = {
    id: receiptId,
    user_id: userId,
    merchant: rawData.merchantName.data,
    location: fullLocation,
    url: receiptImageURL,
  };

  /** Process item data */
  const itemDataArray = rawData.amounts.map((item) => {
    // console.log('Item: ', item);
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

  return { receiptData, itemDataArray };
};


/** Calling database endpoint to store data */
const storeReceiptInfo = async (receiptURL, userId) => {
  try {
    /** Process data */
    const rawReceiptData = await convertReceiptImageToRawData(receiptURL);
    const processedData = processRawData(rawReceiptData, userId, receiptURL);

    /** Save recept and items into the database */
    const receipt = await Receipt.create(processedData.receiptData, { returning: true });
    const items = await Item.bulkCreate(processedData.itemDataArray, { returning: true });

    return {
      receipt_id: receipt.id,
      item_ids: items.map(item => item.id),
    };
  } catch (err) {
    logger.error(err);
    return undefined;
  }
};

/** Transport data received */
const convertReceipt = async (url, userID) => {
  const ids = await storeReceiptInfo(url, userID);
  logger.debug(ids);
  return ids;
};

module.exports = { convertReceipt };
