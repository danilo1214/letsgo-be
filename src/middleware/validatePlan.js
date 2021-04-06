const moment = require("moment");
const { Plan } = require("../models");

module.exports = async (req, res, next) => {
    let plan = req.body;
    const { id } = req.params;

    if (req.method === 'PATCH') {
        const currentPlan = await Plan.findById(id);
        plan = {
            ...currentPlan._doc,
            ...plan
        }
    }
    const { time, cost_lower, cost_upper } = plan;

    if (!time || !cost_lower || !cost_upper) {
        next();
        return;
    }

    if (cost_lower > cost_upper) {
        res.status(500).json({
            error: "Upper cost needs to be higher than lower cost."
        });
        return;
    }

    next();
}