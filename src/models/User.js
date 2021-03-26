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
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    city: {
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