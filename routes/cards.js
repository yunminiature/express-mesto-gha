const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

const cardRouter = express.Router();

cardRouter.get('/cards', auth, getCards);
cardRouter.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/mi).required(),
  }),
}), createCard);
cardRouter.delete('/cards/:cardId', auth, deleteCard);
cardRouter.put('/cards/:cardId/likes', auth, likeCard);
cardRouter.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = cardRouter;
