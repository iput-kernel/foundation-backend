const mongoose = require("mongoose");

const EnglishClassSchema = new mongoose.Schema({
  classGrade: {
    type: Number,
    required: true,
  },
  classChar: {
    type: String,
  },
  studentsId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
}],
  teachersId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  }],
  TimetableId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
  }],
});

module.exports = mongoose.model("EnglishClass", EnglishClassSchema);
