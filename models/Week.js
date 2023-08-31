const mongoose = require("mongoose");

const WeekSchema = new mongoose.Schema({
    usedClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    days: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable'
    }]
});

module.exports = mongoose.model("Week",WeekSchema);
