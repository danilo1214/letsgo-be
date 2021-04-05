const mongoose = require("mongoose");
const { Schema } = mongoose;

const limitationSchema = new Schema({
    $gt: {
        type: Number
    },
    $lt: {
        type: Number
    },
    $eq: {
        type: Schema.Types.Mixed
    },
    field_name: {
        required: true,
        type: String
    }
});

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    }
});

const planSchema = new Schema({
    caption: {
        type: String,
        required: 'Plan caption is required'
    },
    time: {
        type: Date,
        required: 'Plan time is required'
    },
    longitude: {
        type: Number,
        required: 'Plan longitude is required'
    },
    latitude: {
        type: Number,
        required: 'Plan latitude is required'
    },
    description: {
        type: String,
        required: 'Plan description is required'
    },
    cost_lower: {
        type: String,
        required: 'Lower plan cost is required'
    },
    cost_upper: {
        type: Number,
        required: 'Upper plan cost is required'
    },
    current_city: {
        type: String,
        required: 'City is required'
    },
    limitations: {
        type: [limitationSchema]
    },
    messages: {
        type: [messageSchema]
    },
    categories: {
        type: []
    },
    admin: {
        required: 'Plan admin is required',
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Plan = mongoose.model("plan", planSchema);
module.exports = Plan;