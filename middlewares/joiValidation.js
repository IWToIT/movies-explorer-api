const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../constants/index');

const validId = (typeId) => celebrate({
  params: Joi.object().keys({
    [typeId]: Joi.string().hex().length(24),
  }),
});

const validUserRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validDataMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(REGEX_URL).required(),
    trailerLink: Joi.string().regex(REGEX_URL).required(),
    thumbnail: Joi.string().regex(REGEX_URL).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  validId,
  validUserRegister,
  validUserLogin,
  validUserUpdate,
  validDataMovie,
};
