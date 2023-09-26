const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    department: {
        type: String,
    },
    course: {
        type: String,
    },
    classGrade: {
        type: Number,
    },
    classChar: {
        type: String,
        max:2
    },
    studentsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    timetableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Week'
    },
});

module.exports = mongoose.model("Class",ClassSchema); 