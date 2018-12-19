const { Router } = require('express');
const { respondWith } = require('../utils/clientResponse');

const router = Router();

router.get('/generatepresignedurl', function(req,res) {
  var fileurls = [];
  const myBucket = process.env.S3BUCKETNAME;
  const myKey = 'api/uploads/' + 'test.png';
  const params = {Bucket: myBucket, Key: myKey, Expires: signedUrlExpireSeconds, ACL: 'bucket-owner-full-control', ContentType:'image/png'};
  
  /* setting the presigned url expiry time in seconds, 
  also check if user making the request is an authorized 
  user for your app (this will be specific to your app’s 
  auth mechanism so i am skipping it)*/
  const signedUrlExpireSeconds = 60 * 60;
  
  if (err) {
    console.log('Error getting presigned url from AWS S3');
    return respondWith(res, 505, { success : false, message : 'Pre-Signed URL error', urls : fileurls})
    }
    else{
    fileurls[0] = url;
    console.log('Presigned URL: ', fileurls[0]);
    return respondWith(res, 200, { success : true, message : 'AWS SDK S3 Pre-signed urls generated successfully.', urls : fileurls});
    }
   }),
  }

module.exports = router;
