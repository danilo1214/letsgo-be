const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');
const { auth } = require('../middleware');
const { multerUpload, dataUri } = require('../cloud/multer');
const { cloudinaryConfig, uploader } = require('../cloud/cloudinary');
const { streamUpload } = require('../cloud/streamUpload');
const { sendError } = require('../helpers/responses');
const { isPerson } = require('../tensorflow-models/blazeface');
const { sendMail } = require('../sendgrid/mail');


router.post('/', async (req, res) => {
  const { body } = req;

  // Validating if email exists
  const userExists = await User.findOne({ email: body.email });
  if (!body.password) {
    sendError(res, 'Please enter a password.');
    return;
  }
  

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(body.password, salt);
  body.password = password;

  // Saving the user
  const user = new User(body);
  const { SECRET } = process.env;

  user
    .save()
    .then((result) => {
      const token = jwt.sign({ ...user._doc }, SECRET);
      res.json({
        ...user._doc,
        token,
      });
      sendMail({to: body.email, token});

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
    if(!isUserPerson){
      sendError(res, "The photo is not of a person.");
      return;
    }
  
    const { _id } = req.user;

    streamUpload(req)
      .then(async (result) => {
      
        await User.findByIdAndUpdate(
          _id,
          {
            photo_url: result.secure_url,
          },
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { SECRET } = process.env;

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

  const token = jwt.sign({ ...user._doc }, SECRET);
  res.json({
    token,
  });
});

router.get('/authenticate', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
