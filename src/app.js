const vars = require("./vars");
const express = require("express");
const {port} = vars;

const app = new express();
app.listen(port);