const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
    subjectIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }],

});

module.exports = mongoose.model("Timetable",TimetableSchema);
