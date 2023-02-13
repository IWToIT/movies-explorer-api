const router = require('express').Router();

const { validUserUpdate } = require('../middlewares/joiValidation');
const {
  getMe,
  updateUser,
} = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', validUserUpdate, updateUser);

module.exports = router;
