const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6450e618b379ea4a038e6337',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Page not found' });
});

app.listen(PORT);
