const logger = require('./logger');
const { respondWith } = require('./clientResponse');

/* eslint-disable-next-line func-names */
const asyncHandler = fn => function (req, res, next) {
  try {
    /** Call original function with arguments */
    return fn(req, res, next);
  } catch (error) {
    logger.error(`An unexpected error has occured: ${error}`);
    return respondWith(res, 500);
  }
};

module.exports = {
  asyncHandler,
};
