const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    score : {
        type: Number,
        max: 5,
        min: 1,
        default: 3,
    },
    desc: {
        type: String,
        max: 200,
    },
});

module.exports = mongoose.model("Review",ReviewSchema);