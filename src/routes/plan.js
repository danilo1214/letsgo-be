const express = require('express');
const router = express.Router();

const { Plan } = require('../models');
const { auth, validatePlan } = require('../middleware');
const { sendError } = require('../helpers/responses');

router.post('/', auth, validatePlan, (req, res) => {
  const plan = new Plan(req.body);

  const { user } = req;
  plan.admin = user._id;

  plan
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      sendError(res, err.message);
    });
});

router.get('/', (req, res) => {
  const { query } = req;

  if (query.search) {
    query.caption = new RegExp(query.search, 'i');
    delete query.search;
  }

  if (query.dateFrom) {
    query.time = {
      $gte: new Date(query.dateFrom),
    };
    delete query.dateFrom;
  }

  if (query.dateTo) {
    query.time = {
      ...query.time,
      $lte: new Date(query.dateTo),
    };
    delete query.dateTo;
  }

  if (query.costFrom) {
    query.cost_lower = {
      $gte: Number(query.costFrom),
    };
    delete query.costFrom;
  }

  if (query.costTo) {
    query.cost_upper = {
      $lte: Number(query.costTo),
    };
    delete query.costTo;
  }

  Plan.find({
    ...query,
  })
    .then((plans) => {
      res.json(plans);
    })
    .catch((err) => {
      sendError(res, err.message);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Plan.findById(id)
    .populate('admin')
    .then((plan) => {
      res.json(plan);
    })
    .catch((err) => {
      sendError(res, err.message);
    });
});

router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  Plan.findByIdAndDelete(id)
    .then(() => {
      res.json({
        message: 'Successfully deleted',
      });
    })
    .catch((err) => {
      sendError(res, err.message);
    });
});

router.patch('/:id', auth, validatePlan, (req, res) => {
  const { body, params } = req;
  const { id } = params;

  Plan.findByIdAndUpdate(id, { ...body }, { new: true })
    .exec()
    .then((plan) => {
      res.json(plan);
    })
    .catch((err) => {
      sendError(res, err.message);
    });
});

module.exports = router;
