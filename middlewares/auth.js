const jwt = require('jsonwebtoken');
const IncorrectCredError = require('../errors/incorrect-cred');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new IncorrectCredError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new IncorrectCredError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
