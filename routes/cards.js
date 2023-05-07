const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../app');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

const cardRouter = express.Router();

cardRouter.get('', auth, getCards);
cardRouter.post('', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(linkRegex).required(),
  }),
}), createCard);
cardRouter.delete('/:cardId', auth, deleteCard);
cardRouter.put('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), likeCard);
cardRouter.delete('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), dislikeCard);

module.exports = cardRouter;
