const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser, logout } = require('../controllers/users');
const { validUserLogin, validUserRegister } = require('../middlewares/joiValidation');
const auth = require('../middlewares/auth');
const allowedCors = require('../middlewares/allowedCors');

router.use(allowedCors);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', validUserRegister, createUser);
router.post('/signin', validUserLogin, login);
router.delete('/signout', logout);
router.use(auth);
router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден.'));
});

module.exports = router;
