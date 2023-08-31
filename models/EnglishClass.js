const mongoose = require("mongoose");

const EnglishClassSchema = new mongoose.Schema({
    classGrade: {
        type: Number,
        required: true,
    },
    classChar: {
        type: String,
    },
    studentsId: {
        type: Array,
        default: [],
    },
    teachersId: {
        type: Array,
        default: [],
    },
    TimetableId: {
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model("Class",EnglishClassSchema); 