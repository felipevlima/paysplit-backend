const { Router } = require('express');
const { Item } = require('../db/models');
const { respondWith } = require('../utils/clientResponse');
const logger = require('../utils/logger');
const { asyncHandler } = require('../utils/asyncRouteHandler');

const router = Router();

/** GET Items product details */
router.get('/:receipt_id', asyncHandler(async (req, res) => {
  const items = await Item.findAll({ where: { receipt_id: req.params.receipt_id } });
  /** If no items found, likely something went wrong internally */
  if (!items) {
    logger.error(items);
    const msg = 'Something went wrong fetching all items. Please try your search again.';
    return respondWith(res, 500, [msg]);
  }

  return respondWith(res, 200, ['Returning all found items'], { items });
}));

/** GET Items invoice details */
router.get('/:invoice_id', asyncHandler(async (req, res) => {
  const items = await Item.findAll({ where: { invoice_id: req.params.invoice_id } });

  /** If no items found, likely internal server error */
  if (!items) {
    logger.error(items);
    const errMsg = 'Something went wrong fetching all items. Try again!';
    return respondWith(res, 500, [errMsg]);
  }
  return respondWith(res, 200, ['Returning all found items'], { items });
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  /** Early exist if Item id is not found */
  if (!item) {
    logger.error(item);
    return respondWith(res, 500, ['An error occurred while updating Item']);
  }
  const updateItem = await Item.update({
    receipt_id: req.body.receipt_id || item.receipt_id,
    invoice_id: req.body.invoice_id || item.invoice_id,
    product: req.body.product || item.product,
    price: item.price,
  }, { where: { id: req.body.params } },
  { returning: true });

  /** Early exist if there isn't anything to update */
  if (!updateItem) {
    logger.error(updateItem);
    return respondWith(res, 500, ['An error occurred while updating Item']);
  }

  return respondWith(res, 200, ['Item updated successfully'], { updateItem });
}));

module.exports = router;
