/** Check Please - Signup Rotuer */
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const logger = require('../utils/logger');
const { respondWith } = require('../utils/clientResponse');
const { asyncHandler } = require('../utils/asyncRouteHandler');


const router = Router();

/**
 * Helper function to hash password using bcrypt.
 * @param {string} password The password to be hashed.
 */
/* eslint-disable-next-line func-names */
const hashPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    logger.error(`Password hashing error: ${error}`);
    return '';
  }
};

/**
 * Signup Routes
 */
router.post('/signup', asyncHandler(async (req, res) => {
  /** Check if user exist already */
  const checkUser = await User.findOne({ where: { email: req.body.email } });
  if (checkUser) {
    return respondWith(res, 422, ['User with that email already exist']);
  }
  /** Hash the user's password and then create a new User */
  const hash = await hashPassword(req.body.password);
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: hash,
  };
  const savedUser = await User.create(newUser, { w: 1 });
  /** Early exit if saving user fails */
  if (!savedUser) {
    logger.error(`User creation error: ${savedUser}`);
    return respondWith(res, 500, ['Something went wrong trying to create the user.']);
  }

  // FIXME: Refresh tokens for expired tokens
  /** Success case where user is created */
  const token = jwt.sign({ _id: newUser.id }, process.env.SECRETKEY, { expiresIn: '60 days' });
  return respondWith(res, 200, ['Created User.'], {
    auth_token: token,
    recovery_token: savedUser.userRecoveryToken,
    user_id: savedUser.id,
  });
}));

/**
 * Login Routes
 */
router.post('/login', asyncHandler(async (req, res) => {
  logger.log('email', req.body.email);

  /** Get the user to compare password */
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return respondWith(res, 400, ['Invalid credentials, please try again.']);
  }

  const passwordMatched = await bcrypt.compare(req.body.password, user.password);
  /** Early exit on non matching credentials */
  if (!passwordMatched) {
    return respondWith(res, 400, ['Invalid credentials, please try again.']);
  }

  const token = jwt.sign({ _id: user.id }, process.env.SECRETKEY, { expiresIn: '60 days' });

  return respondWith(res, 200, ['User logged in.'], {
    auth_token: token,
    recovery_token: user.recovery_token,
    user_id: user.id,
  });
}));

module.exports = router;
