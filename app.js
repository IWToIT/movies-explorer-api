const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
require('dotenv').config();
const routes = require('./routes');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimit = require('./middlewares/rateLimit');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/filmsdb' } = process.env;
mongoose.set('strictQuery', true);

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(helmet());
app.use(rateLimit);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT);
