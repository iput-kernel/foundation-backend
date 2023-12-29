import mongoose from "mongoose";

type TimetableEntryType = {
  subject: mongoose.Schema.Types.ObjectId;
  room: mongoose.Schema.Types.ObjectId;
};

export type TimetableType = {
  usedClass: mongoose.Schema.Types.ObjectId;
  weekEntries: TimetableEntryType[][];
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
  weekEntries: {
    type: [[TimetableEntrySchema]],
    validate: [arrayLimit, "{PATH} exceeds the limit of array length"],
  },
});

function arrayLimit(val: [][]) {
  return val.length <= 7 && val.every((innerArray) => innerArray.length <= 7);
}

const TimeTable = mongoose.model<TimetableType>("Timetable", TimetableSchema);
export default TimeTable;
