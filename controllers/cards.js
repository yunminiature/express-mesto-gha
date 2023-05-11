const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const DataError = require('../errors/data-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError());
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .orFail(() => {
      next(new NotFoundError('Card not found'));
    })
    .then((card) => {
      if (card.owner === req.params.cardId) {
        res.send({ data: card });
      } else {
        const err = new Error('Forbidden');
        err.statusCode = 403;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError());
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('Card not found'));
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError());
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('Card not found'));
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError());
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
