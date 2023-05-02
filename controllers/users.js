const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users })
    })
    .catch((err) => {
      if((err.name == 'CastError') || (err.name == 'ValidationError')){
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message })
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => {
      if((err.name == 'CastError') || (err.name == 'ValidationError')){
        res.status(400).send({ message: err.message });
      } else if (err.message === 'Not found'){
        res.status(404).send({message: 'User not found'})
      } else {
        res.status(500).send({ message: err.message })
      }
    })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => {
      if((err.name == 'CastError') || (err.name == 'ValidationError')){
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message })
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
      upsert: true
    }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if((err.name == 'CastError') || (err.name == 'ValidationError')){
        res.status(400).send({ message: err.message });
      } else if (err.message === 'Not found'){
        res.status(404).send({message: 'User not found'})
      } else {
        res.status(500).send({ message: err.message })
      }
    });
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if((err.name == 'CastError') || (err.name == 'ValidationError')){
        res.status(400).send({ message: err.message });
      } else if(err.message === 'Not found'){
        res.status(404).send({message: 'User not found'})
      } else {
        res.status(500).send({ message: err.message })
      }
    });
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
}