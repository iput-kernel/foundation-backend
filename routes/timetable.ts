import httpStatus from "http-status";
import Subject from "../models/Subject";
import Timetable from "../models/Timetable";
import Room from "../models/Room";
import { Router as timetableRoute } from "./route";

// Create a Timetable
timetableRoute.post("/", async (req, res) => {
  const { usedClass, weekEntries } = req.body;

  try {
    const timetableEntries = await Promise.all(
      weekEntries.map(
        async (
          dayEntries: { subject: string | null; room: number | null }[],
        ) => {
          return await Promise.all(
            dayEntries.map(
              async ({ subject: subjectName, room: roomNumber }) => {
                let subject = null;
                let room = null;

                if (subjectName) {
                  subject = await Subject.findOne({ subjectName });
                  if (!subject) {
                    throw new Error(`${subjectName} という科目は存在しません`);
                  }
                }

                if (roomNumber) {
                  room = await Room.findOne({ roomNumber });
                  if (!room) {
                    throw new Error(`${roomNumber} という教室は存在しません`);
                  }
                }

                return { subject: subject?._id, room: room?._id };
              },
            ),
          );
        },
      ),
    );

    const timetable = new Timetable({
      usedClass,
      weekEntries: timetableEntries,
    });
    await timetable.save();
    res.status(201).json(timetable);
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

// Get a Timetable by ID
timetableRoute.get("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate([
        {
          path: "weekEntries.subject",
          model: "Subject",
        },
        {
          path: "weekEntries.room",
          model: "Room",
        },
      ])
      .populate({
        path: "usedClass",
        model: "Class",
      });
    if (!timetable) {
      return res
        .status(404)
        .json({ message: "指定されたIDの時間割は存在しません" });
    }
    res.status(httpStatus.OK).json(timetable);
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

// Get all Timetables
timetableRoute.get("/", async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate({
        path: "usedClass",
        model: "Class",
      })
      .populate([
        {
          path: "weekEntries.subject",
          model: "Subject",
        },
        {
          path: "weekEntries.room",
          model: "Room",
        },
      ]);
    res.status(httpStatus.OK).json(timetables);
  } catch (err: any) { // eslint-disable-line
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

export default timetableRoute;
