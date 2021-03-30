const vars = require("./vars");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')


const {port, dbURI} = vars;
const app = new express();

mongoose.connect(dbURI).then(conn => {
    app.listen(port);
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.use((req, res, next) => {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();
    });
    console.log("listening");

    app.use("/plan", require("./routes/plan"));
});
