const { Router } = require('express');
const { respondWith } = require('../utils/clientResponse');
const getURL = require('../utils/getS3URL');

const router = Router();

router.get('/geturl', (req, res) => {
  getURL.generatePresignedURL(req, res);
});
module.exports = router;
