const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router();

const { User } = require("../models");

router.post("/", async (req, res) => {
    const { body } = req;

    // Validating if email exists
    const userExists = await User.findOne({ email: body.email });
    if (!body.password) {
        res.status(500).json({
            error: "Please enter a password"
        });
    }
    if (userExists) {
        res.status(500).json({
            error: "Email already exists"
        });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(body.password, salt);
    body.password = password;

    // Saving the user
    const user = new User(body);
    user.save().then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).json({
            error: err.message
        });
    })
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(500).json({
            error: "Please enter both username and password."
        });
    }

    const user = await User.findOne({ email });

    if(!user){
        res.status(500).json({
            error: "Email or password are incorrect."
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        res.status(500).json({
            error: "Email or password are incorrecttt."
        });
    }

    res.json({
        message: "Logged in!"
    });
    
});

module.exports = router;
