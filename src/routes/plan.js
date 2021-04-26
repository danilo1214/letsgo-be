const express = require("express");
const router = express.Router();

const { Plan } = require("../models");
const { auth, validatePlan } = require("../middleware");


router.post("/", auth, validatePlan, (req, res) => {
    const plan = new Plan(req.body);

    const { user } = req;
    plan.admin = user._id;

    plan.save().then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).json(err.message);
    });
});

router.get("/", (req, res) => {
    const { query } = req;


    
    if(query.caption){
        query.caption = new RegExp(query.caption, "i");
    }

    if(query.dateFrom){
        query.time = {
            $gte: new Date(query.dateFrom)
        }
        delete query.dateFrom;
    }

    if(query.dateTo){
        query.time = {
            ...query.time,
            $lte: new Date(query.dateTo)
        }
        delete query.dateTo;
    }

    if(query.priceFrom){
        query.cost_lower = {
            $gte: Number(query.priceFrom)
        }
        delete query.priceFrom;
    }

    if(query.priceTo){
        query.cost_upper = {
            $lte:Number( query.priceTo)
        }
        delete query.priceTo;
    }


    console.log(query)
    Plan.find({
        ...query
    }).then(plans => {
        res.json(plans);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    })
});

router.get("/:id", (req, res) => {
    const { id } = req.params;

    Plan.findById(id).populate("admin").then(plan => {
        res.json(plan);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    })
});

router.delete("/:id", auth, (req, res) => {
    const { id } = req.params;

    Plan.findByIdAndDelete(id).then(() => {
        res.json({
            message: "Successfully deleted"
        });
    }).catch(err => {
        console.log(err);
        res.status(404).json({
            message: err.message
        });
    })
});

router.patch("/:id", auth, validatePlan, (req, res) => {
    const { body, params } = req;
    const { id } = params;

    Plan.findByIdAndUpdate(id, { ...body }, { new: true }).exec().then(plan => {
        res.json(plan);
    }).catch(err => {
        console.log(err.message);
        res.status(500).json({
            message: err.message
        })
    })
});

module.exports = router;
