const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getUserMe,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRouter = express.Router();

userRouter.get('', auth, getUsers);
userRouter.get('/me', auth, getUserMe);
userRouter.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().max(24).required(),
  }),
}), getUser);
userRouter.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
userRouter.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/mi).required(),
  }),
}), updateAvatar);

module.exports = userRouter;
