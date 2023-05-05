const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet());
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Page not found' });
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT);
