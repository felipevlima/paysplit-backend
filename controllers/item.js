const { Router } = require('express');
const { Item } = require('../db/models');
const { respondWith } = require('../utils/clientResponse');
const logger = require('../utils/logger');
const { asyncHandler } = require('../utils/asyncRouteHandler');

const router = Router();

/** GET Items product details */
router.get('/item/:receipt_id', asyncHandler(async (req, res) => {
  const items = await Item.findAll({ where: { receipt_id: req.params.receipt_id } });
  /** If no items found, likely something went wrong internally */
  if (!items) {
    logger.error(items)
    const msg = 'Something went wrong fetching all items. Please try your search again.';
    return respondWith(res, 500, [msg]);
  }

  return respondWith(res, 200, ['Returning all found items'], { items });
}));
