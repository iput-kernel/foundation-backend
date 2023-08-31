const mongoose = require("mongoose");

const FloorSchema = new mongoose.Schema({
    floor: {
        type: Number,
        required: true,        
    },
    roomsId: {
        type: Array,
        default: [],
    },
});


        