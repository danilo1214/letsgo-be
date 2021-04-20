const express = require("express");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const router = express.Router();
const { User } = require("../models");
const { auth } = require("../middleware");

router.post("/", async (req, res) => {
    const { body } = req;

    // Validating if email exists
    const userExists = await User.findOne({ email: body.email });
    if (!body.password) {
        res.status(500).json({
            error: "Please enter a password"
        });
        return;
    }
    if (userExists) {
        res.status(500).json({
            error: "Email already exists"
        });
        return;
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(body.password, salt);
    body.password = password;

    // Saving the user
    const user = new User(body);
    const { SECRET } = process.env;

    user.save().then(result => {
        const token = jwt.sign({ ...user._doc }, SECRET);
        res.json({
            ...user._doc,
            token
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    })
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { SECRET } = process.env;

    if (!email || !password) {
        res.status(500).json({
            error: "Please enter both username and password."
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(500).json({
            error: "Email or password are incorrect."
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        res.status(500).json({
            error: "Email or password are incorrecttt."
        });
    }

    const token = jwt.sign({ ...user._doc }, SECRET);
    res.json({
        token
    });

});

router.get("/authenticate", auth, (req, res) => {
    console.log(req.user);
    res.json(req.user);
});

module.exports = router;
