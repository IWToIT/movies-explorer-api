const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/userScheme');
const {
  VALIDATION_ERROR,
  CAST_ERROR,
} = require('../constants');
const DublicateKeyError = require('../errors/DublicateKeyError');
const NotFoundError = require('../errors/NotFoundError');
const BadReqError = require('../errors/BadReqError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .send({ userInfo: { _id: user._id, email: user.email, name: user.name }, message: 'Пользователь успешно авторизирован' });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    .send({ message: 'Пользователь успешно вышел.' });
};

module.exports.getMe = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден.'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Передан некорректный _id для поиска пользователя.'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => Users.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return next(new BadReqError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new DublicateKeyError('Пользователь с таким email уже существует.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь не найден.'))
    .then((user) => {
      res.send({ user, message: 'Вы успешно изменили информацию пользователя.' });
    })
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return next(new BadReqError('Переданы некорректные данные при обновлении пользователя.'));
      }
      if (err.code === 11000) {
        return next(new DublicateKeyError('Пользователь с таким email уже существует.'));
      }
      return next(err);
    });
};
