import mongoose from "mongoose";

export type TimetableType = {
  usedClass: mongoose.Schema.Types.ObjectId;
  weekSubjects: mongoose.Schema.Types.ObjectId[][];
  weekRooms: mongoose.Schema.Types.ObjectId[][];
};

const TimetableEntrySchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
});

const TimetableSchema = new mongoose.Schema<TimetableType>({
  usedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  weekSubjects: {
    type: [
      [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
      ],
    ],
    validate: [arrayLimit, '{PATH} exceeds the limit of array length']
  },
  weekRooms: {
    type: [
      [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
      ],
    ],
    validate: [arrayLimit, '{PATH} exceeds the limit of array length']
  },
});

function arrayLimit(val:[][]) {
  return val.length <= 5 && val.every(innerArray => innerArray.length <= 7);
}

const TimeTable = mongoose.model<TimetableType>("Timetable", TimetableSchema);
export default TimeTable;