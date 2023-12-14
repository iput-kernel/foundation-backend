import mongoose from "mongoose";

export type TimetableType = {
  usedClass: mongoose.Schema.Types.ObjectId;
  weekSubjects: mongoose.Schema.Types.ObjectId[][];
  weekRooms: mongoose.Schema.Types.ObjectId[][];
};

const TimetableSchema = new mongoose.Schema<TimetableType>({
  usedClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  weekSubjects: [
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  ],
  weekRooms: [
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  ],
});

const TimeTable = mongoose.model<TimetableType>("Timetable", TimetableSchema);
export default TimeTable;