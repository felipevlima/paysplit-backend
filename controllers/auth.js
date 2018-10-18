/* eslint-disable no-console */

/** Check Please - Signup Rotuer */
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../db/models');

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
    console.error(`Password hashing error: ${error}`);
    return '';
  }
};

/**
 * Signup Routes
 */
router.post('/signup', async (req, res) => {
  /** Check if user exist already */
  const checkUser = await models.User.findOne({ where: { email: req.body.email } });
  if (checkUser) {
    return res.status(422)
      .json({ message: 'User with that email already exist' });
  }
  const hash = await hashPassword(req.body.password);
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: hash,
  };
  const savedUser = await models.User.create(newUser, { w: 1 });
  /** Early exit if saving user fails */
  if (!savedUser) {
    console.error(`User creation error: ${savedUser}`);
    res.json(savedUser);
  }

  /** Success case where user is created */
  const token = jwt.sign({ _id: newUser.id }, process.env.SECRETKEY, { expiresIn: '60 days' });
  return res.status(200)
    .cookie('nToken', token, { maxAge: 900000, httpOnly: true })
    .json({
      message: 'Created user successfully.',
      userRecoveryToken: savedUser.userRecoveryToken,
      user_id: savedUser.id,
    });
});

/**
 * Login Routes
 */
router.post('/login', async (req, res) => {
  console.log('email', req.body.email);

  /** Get the user to compare password */
  const user = await models.User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res.status(403)
      .json({ message: 'Bad credential, please try again.' });
  }

  const result = await bcrypt.compare(req.body.password, user.password);
  /** Early exit on non matching credentials */
  if (!result) {
    return res.status(400).json({
      message: 'Invalid credentials, please try again.',
    });
  }

  const token = jwt.sign({ _id: user.id }, process.env.SECRETKEY, { expiresIn: '60 days' });

  return res
    .cookie('nToken', token, { maxAge: 900000, httpOnly: true })
    .status(200)
    .json({
      message: 'user logged in successfully',
      userRecoveryToken: user.userRecoveryToken,
      user_id: user.id,
    });
});

/**
 * Logout Route
 */
/* eslint-disable-next-line arrow-body-style */
router.get('/logout', (req, res) => {
  return res.clearCookie('jwtToken').send('you are logged out');
});

module.exports = router;
