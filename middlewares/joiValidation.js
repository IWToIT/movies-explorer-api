const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../constants/index');

const validId = (typeId) => celebrate({
  params: Joi.object().keys({
    [typeId]: Joi.string().hex().length(24),
  }),
});

const validAuthName = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX_URL),
  }),
});

const validUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const userAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(REGEX_URL),
  }),
});

const validDataCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(REGEX_URL),
  }),
});

module.exports = {
  validId,
  validAuthName,
  validUserInfo,
  userAvatarValid,
  validDataCard,
};
