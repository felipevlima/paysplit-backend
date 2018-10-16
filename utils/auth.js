const jwt = require('jsonwebtoken');

/* eslint-disable-next-line arrow-body-style */
exports.createJWT = (dbObject) => {
  return jwt.sign({ id: dbObject.dataValues.id }, process.env.SECRETKEY);
};

exports.cookieOptions = () => {
  // Cookie should be good for 48 hours
  const jsonObject = {
    maxAge: 172800000,
    httpOnly: true,
  };
  return jsonObject;
};

exports.setUserIDCookie = (dbObject, resObject) => {
  const token = jwt.sign({ id: dbObject.dataValues.id }, process.env.SECRETKEY);
  const cookieOptions = {
    maxAge: 172800000,
    httpOnly: true,
  };
  resObject.cookie('jwtToken', token, cookieOptions);
};
