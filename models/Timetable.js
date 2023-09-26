const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
    usedClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    weekSubjects: [[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]]
});

module.exports = mongoose.model("Timetable",TimetableSchema);
