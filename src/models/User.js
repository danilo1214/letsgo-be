const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: 'Email address is required',
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
      min: 8,
      max: 255,
    },
    password: {
      type: String,
      required: 'Password is required',
      min: 8,
      max: 255,
    },
    first_name: {
      type: String,
      required: 'First name is required',
    },
    last_name: {
      type: String,
      required: 'Last name is required',
    },
    photo_url: {
      type: String,
      required: 'User photo is required',
    },
    birth_date: {
      type: Date,
      required: 'Birth date is required',
    },
    sex: {
      type: String,
      required: 'Sex is required',
    },
    ratings: {
      type: [ratingSchema],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('user', userSchema);
module.exports = User;
