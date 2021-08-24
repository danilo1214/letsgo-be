const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.header('Authorization')
    ? req.header('Authorization').split(' ')[1]
    : null;
  if (!token) {
    res.status(500).json({
      error: 'You need to be logged in to access this endpoint.',
    });
    return;
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(500).json({
      error: 'Invalid token.',
    });
  }
};
