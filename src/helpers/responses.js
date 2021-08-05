const sendError = (res, error, status = 501) => {
  res.status(status).json({
    error,
  });
};

module.exports = {
  sendError,
};
