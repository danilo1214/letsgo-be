const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

const { auth } = require('../middleware');
const { cloudinaryConfig, multerUpload, streamUpload } = require('../cloud');
const { isPerson } = require('../tensorflow-models/blazeface');
const { User } = require('../models');
const { sendError } = require('../helpers/responses');
const { sendMail } = require('../sendgrid/mail');

const { JWT_SECRET } = process.env;

const router = express.Router();

router.post('/', async (req, res) => {
  const { body } = req;

  const userExists = await User.findOne({ email: body.email });
  if (userExists) {
    sendError(res, 'Email is already in use.');
    return;
  }
  if (!body.password) {
    sendError(res, 'Please enter a password.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  body.password = await bcrypt.hash(body.password, salt);
  body.photo_verified = false;
  body.email_verified = false;
  const user = new User(body);

  user
    .save()
    .then(async (result) => {
      const token = jwt.sign({ ...result._doc }, JWT_SECRET);
      const { email, _id } = result._doc;
      res.json({ ...result._doc, token });
      await User.findByIdAndUpdate(_id, { email_token: token });
      sendMail({ to: email, token, host: req.hostname });
    })
    .catch((err) => {
      sendError(res, err.message);
    });
});

router.post(
  '/photo',
  auth,
  cloudinaryConfig,
  multerUpload,
  async (req, res) => {
    if (!req.file) {
      sendError(res, 'No image found', 404);
      return;
    }

    const isUserPerson = await isPerson(req.file.buffer);
    if (!isUserPerson) {
      sendError(res, 'The photo is not of a person.');
      return;
    }

    const { _id } = req.user;
    streamUpload(req)
      .then(async (result) => {
        await User.findByIdAndUpdate(
          _id,
          { photo_url: result.secure_url, photo_verified: true },
          { new: true }
        )
          .exec()
          .then((result) => {
            res.json(result);
          });
      })
      .catch((err) => {
        sendError(res, err.message);
      });
  }
);

router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  if (!token) {
    sendError(res, 'You did not provide a token.');
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    User.findByIdAndUpdate(user._id, { email_verified: true })
      .exec()
      .then((result) => res.json(result))
      .catch((err) => sendError(res, err.message));
  } catch (err) {
    sendError(res, err || err);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    sendError(res, 'Please enter both username and password.');
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    sendError(res, 'Email or password are incorrect.');
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    sendError(res, 'Email or password are incorrect.');
    return;
  }

  const token = jwt.sign({ ...user._doc }, JWT_SECRET);
  res.json({
    token,
  });
});

router.get('/authenticate', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
