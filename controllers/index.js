const { Router } = require('express');
const { respondWith } = require('../utils/clientResponse');

const router = Router();

/** Simple test route or ping route to check availability */
router.get('/', (req, res) => respondWith(res, 200));

/** Express sanitizer */
router.post('/', (req, res) => {
  // replace an HTTP posted body property with the sanitized string
  req.body.sanitized = req.sanitize(req.body.propertyToSanitize);
  // send the response
  res.send(`Your value was sanitized to: ${req.body.sanitized}`);
});

module.exports = router;
