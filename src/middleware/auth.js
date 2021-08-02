const jwt = require('jsonwebtoken');

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
    const { SECRET } = process.env;
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      error: 'Invalid token.',
    });
  }
};
