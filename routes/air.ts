import httpStatus from "http-status";
import Subject from "../models/Subject";
import Timetable from "../models/Timetable";
import { Router as airRoute } from "../route";

airRoute.post("/", async (req, res) => {
  const { usedClass, weekSubjects } = req.body;

  try {
    const timetableSubjects = await Promise.all(
      weekSubjects.map(async (daySubjects: string[]) => {
        return await Promise.all(
          daySubjects.map(async (name: string) => {
            const subject = await Subject.findOne({ subjectName: name });
            if (!subject) {
              throw new Error(`${name} という科目は存在しません`);
            }
            return subject._id;
          }),
        );
      }),
    );

    const timetable = new Timetable({
      usedClass,
      weekSubjects: timetableSubjects,
    });
    await timetable.save();
    res.status(201).json(timetable);
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

// Get a Timetable by ID
airRoute.get("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate([
        {
          path: "weekSubjects",
          model: "Subject",
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
  } catch (err: any) { // eslint-disable-line
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

// Get all Timetables
airRoute.get("/", async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate({
        path: "weekSubjects",
        model: "Subject",
      })
      .populate({
        path: "usedClass",
        model: "Class",
      });
    res.status(httpStatus.OK).json(timetables);
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

export default airRoute;
