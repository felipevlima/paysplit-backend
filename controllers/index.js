const { Router } = require('express');

const router = Router();

/** Express sanitizer */
router.post('/', (req, res) => {
  // replace an HTTP posted body property with the sanitized string
  req.body.sanitized = req.sanitize(req.body.propertyToSanitize);
  // send the response
  res.send(`Your value was sanitized to: ${req.body.sanitized}`);
});

module.exports = router;
