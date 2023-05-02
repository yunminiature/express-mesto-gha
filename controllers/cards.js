const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards })
    })
    .catch((err) => {
      res.status(500).send({message: err.message})
    })
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if(err.name == 'ValidationError'){
        const message = Object.values(err.errors).map(error => error.message).join('; ');
        res.status(400).send({message: message});
      } else {
        res.status(500).send({ message: err.message })
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      if(err.message === 'Not found'){
        res.status(404).send({message: 'Card not found'})
      } else {
        res.status(500).send({message: err.message})
      }
    })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      if(err.name == 'ValidationError'){
        const message = Object.values(err.errors).map(error => error.message).join('; ');
        res.status(400).send({message: message});
      } else if (err.message === 'Not found'){
        res.status(404).send({message: 'Card not found'})
      } else {
        res.status(500).send({ message: err.message })
      }
    });
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      if(err.name == 'ValidationError'){
        const message = Object.values(err.errors).map(error => error.message).join('; ');
        res.status(400).send({message: message});
      } else if (err.message === 'Not found'){
        res.status(404).send({message: 'Card not found'})
      } else {
        res.status(500).send({ message: err.message })
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}