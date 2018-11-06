/** PaySplit - User Rotuer */
const { Router } = require('express');
const { User } = require('../db/models');
const logger = require('../utils/logger');
const { respondWith } = require('../utils/clientResponse');


const router = Router();


/** Find User by Id */
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    logger.error(user);
    return respondWith(res, 500, ['User not found.']);
  }
  return respondWith(res, 200, ['User found'], {
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    email: user.email,
  });
});
