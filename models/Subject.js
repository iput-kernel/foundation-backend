const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        default: "",
        required: true,
    },
    teachersId: {
        type: Array,
        default: [],
    },
    reviewsId:{
        type: Array,
        default: [],
    },
    grade: {
        type: Number,
    },
    count: {
        type: Number,
        default: 0,
    },
    isRequire: {
        type: Boolean,
        default: false,
    },
    
});

module.exports = mongoose.model("Subject",SubjectSchema);