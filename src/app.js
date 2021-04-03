const vars = require("./vars");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser')


const {port} = vars;
const app = new express();

dotenv.config();
const {dbURI} = process.env;

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true}).then(conn => {
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
    console.log(`App listening on PORT ${port}`);

    app.use("/plan", require("./routes/plan"));
    app.use("/user", require("./routes/user"));

}).catch(err=>{
    console.log(err);
});
