/* eslint-disable no-console */
const jwt = require('jsonwebtoken');

/*
 *  Check for login token on every request
 */
const verifyAuthentication = (req, res, next) => {
  // FIXME: Remove cookies and switch to Auth header
  if (typeof req.cookies.jwtToken === 'undefined' || req.cookies.jwtToken === null) {
    req.user = null;
    next();
  }

  const token = req.cookies.nToken;
  // Synchronous verification
  try {
    const decodedToken = jwt.verify(token, process.env.SECRETKEY);
    console.log(decodedToken);
    // console.log("***Authenticate***");
    req.user = decodedToken.payload;
  } catch (err) {
    console.log('Authentication Error:', err.message);
  }
  next();
};

module.exports = {
  verifyAuthentication,
};
