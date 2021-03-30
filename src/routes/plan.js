const express = require("express");
const router = express.Router();

const {Plan} = require("../models");

router.post("/", (req,res)=> {
    const plan = new Plan(req.body);

    console.log(req.body);

    plan.save().then(result=>{
        res.json(result);
    }).catch(err=>{
        res.json(err.message);
    });
});

module.exports = router;