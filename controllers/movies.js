const Movies = require('../models/movieScheme');
const Users = require('../models/userScheme');
const {
  CAST_ERROR,
  VALIDATION_ERROR,
} = require('../constants');
const BadReqError = require('../errors/BadReqError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const DublicateKeyError = require('../errors/DublicateKeyError');

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then(res.send)
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Users.findById(req.user._id)
    .then((user) => {
      Movies.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
        owner: user._id,
      })
        .then((movie) => res.send(movie))
        .catch((err) => {
          if (err.message === VALIDATION_ERROR) {
            return next(new BadReqError('Переданы некорректные данные для добавления фильма.'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .orFail(new NotFoundError('Данный фильм не найден.'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('У вас отсутствуют права для удаления.'));
      }
      return Movies.findByIdAndDelete(movie._id.toString()).then(() => {
        res.send(movie);
      });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Переданы некорректные данные карточки.'));
      }
      return next(err);
    });
};
