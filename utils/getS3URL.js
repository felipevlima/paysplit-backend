const AWS = require('aws-sdk');
const logger = require('./logger');
const { respondWith } = require('./clientResponse');


const credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
};
AWS.config.update({
  // eslint-disable-next-line object-shorthand
  credentials: credentials,
  region: process.env.S3_REGION,
});

const s3 = new AWS.S3();

const params = {
  Bucket: process.env.S3_BUCKET,
  Expires: 100, // time to expire in seconds

  Fields: {
    key: 'image.jpg',
  },
  conditions: [
    { acl: 'private' },
    { success_action_status: '201' },
    ['starts-with', '$key', ''],
    ['content-length-range', 0, 100000],
    { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
  ],
};

const generatePresignedURL = async (req, res) => {
  params.Fields.key = req.query.filename || 'filename.png';
  s3.createPresignedPost(params, (err, data) => {
    if (err) {
      logger.error(err);
      return respondWith(res, 500, ['Error creating presigned URL']);
    }
    return respondWith(res, 200, { data });
  });
};

module.exports = { generatePresignedURL };
