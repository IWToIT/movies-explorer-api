const router = require('express').Router();

const { validDataMovie, validId } = require('../middlewares/joiValidation');
const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validDataMovie, saveMovie);
router.delete('/:movieId', validId('movieId'), deleteMovie);

module.exports = router;
