const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,    
    },
    course: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("Teacher",TeacherSchema);