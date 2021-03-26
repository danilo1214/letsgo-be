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
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost_lower: {
        type: String,
        required: true
    },
    cost_upper: {
        type: Number,
        required: true
    },
    current_city:{
        type: String,
        required: true
    },
    limitations: {
        type: [limitationSchema]
    },
    messages: {
        type: [messageSchema]
    },
    categories: {
        type: []
    }
});

const Plan = mongoose.model("plan", planSchema);
module.exports = Plan;