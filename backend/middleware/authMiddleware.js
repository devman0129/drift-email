const { ConnectContactLens } = require('aws-sdk');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authentification = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

const authorization = (req, res, next) => {
  // Check if the user is authenticated and has the necessary permissions
  if (req.isAuthenticated() && req.user.role === 'admin') {
    // User is authorized to access the route, so call next middleware/route handler
    next();
  } else {
    // User is not authorized, so send a 401 Unauthorized response
    res.status(401).send('Unauthorized');
  }
};

module.exports = {
  authentification,
  authorization,
};
