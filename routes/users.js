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

userRouter.get('/users', auth, getUsers);
userRouter.get('/users/:userId', auth, getUser);
userRouter.get('/users/me', auth, getUserMe);
userRouter.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
userRouter.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/mi).required(),
  }),
}), updateAvatar);

module.exports = userRouter;
