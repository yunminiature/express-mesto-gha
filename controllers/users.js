const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(400).send({ message: err.message });
      } else if (err.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const getUserMe = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(400).send({ message: err.message });
      } else if (err.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      });
    })
    .then((user) => {
      res.status(201).send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.code === 11000) {
        res.status(409).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(400).send({ message: err.message });
      } else if (err.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(400).send({ message: err.message });
      } else if (err.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
