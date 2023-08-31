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
    studentsId: {
        type: Array,
        default: [],
    },
    timetableId: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("Class",ClassSchema); 