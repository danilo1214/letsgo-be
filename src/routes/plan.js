const express = require("express");
const router = express.Router();

const {Plan} = require("../models");

router.post("/", (req,res)=> {
    const plan = new Plan(req.body);

    console.log(req.body);

    plan.save().then(result=>{
        res.json(result);
    }).catch(err=>{
        res.status(500).json(err.message);
    });
});

router.get("/", (req, res) => {
    const {query} = req;

    Plan.find({
        ...query
    }).then(plans=>{
        res.json(plans);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    })
});

router.get("/:id", (req, res)=>{
    const {id} = req.params;

    Plan.findById(id).then(plan=>{
        res.json(plan);
    }).catch(err=>{
        res.status(500).json({
            message: err.message
        });
    })
});

router.delete("/:id", (req,res) => {
    const {id} = req.params;

    Plan.findByIdAndDelete(id).then(()=>{
        res.json({
            message: "Successfully deleted"
        });
    }).catch(err=>{
        console.log(err);
        res.status(404).json({
            message: err.message
        });
    })
});

router.patch("/:id", (req,res) => {
    const {body, params} = req;
    const {id} = params;

    Plan.findByIdAndUpdate(id, {...body}, {new: true}).exec().then(plan=>{
        res.json(plan);
    }).catch(err=>{
        console.log(err.message);
        res.status(500).json({
            message: err.message
        })
    })
});

module.exports = router;