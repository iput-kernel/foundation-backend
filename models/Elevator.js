const mongoose = require('mongoose');

const ElevatorSchema = new mongoose.Schema({
    color: {
        type: String,
        default: "",
    },

    stops: {
        type: Array,
        default: [],
    }
});
        