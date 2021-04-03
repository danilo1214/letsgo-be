const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
})

const userSchema = new Schema({
    email: {
        type: String,
        required: 'Email address is required',
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        min: 8,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 255
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    photo_url: {
        type: String,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    ratings: {
        type: [ratingSchema]
    }
}, {
    timestamps: true
});

const User = mongoose.model("user", userSchema);
module.exports = User;