import httpStatus from "http-status";
import Subject from "../models/Subject";
import Timetable from "../models/Timetable";
import { Router, Response } from "express";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

const airRoute = Router();

airRoute.post(
  "/",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      if (req.user!.credLevel < 4) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const { usedClass, weekSubjects } = req.body;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  },
);

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
  } catch (err: unknown) {
    if (err instanceof Error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    } else {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "未知のエラーが発生しました" });
    }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

export default airRoute;
