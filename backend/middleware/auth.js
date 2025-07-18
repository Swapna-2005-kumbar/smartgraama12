const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    // Fetch user role
    User.findById(decoded.userId).then(user => {
      req.userRole = user?.role;
      next();
    }).catch(() => res.status(401).json({ message: 'User not found' }));
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
