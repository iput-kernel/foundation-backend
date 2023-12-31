import httpStatus from "http-status";
import Teacher from "../models/Teacher";
import User from "../models/Account/User";
import { Router, Response } from "express";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

const teacherRoute = Router();

// Create a teacher but only admin or has cred-level of 4 or higher
teacherRoute.post(
  "/",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId).populate({
        path: "auth",
        model: "Auth",
      });
      if (req.user!.credLevel < 4 || user!.auth.trustLevel < 4) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const newTeacher = new Teacher(req.body);
      const savedTeacher = await newTeacher.save();
      res.status(httpStatus.OK).json(savedTeacher);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);
// Get all teachers
teacherRoute.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(httpStatus.OK).json(teachers);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});
// Get a teacher by id
teacherRoute.get("/course/:course", async (req, res) => {
  try {
    const teachers = await Teacher.find({ course: req.params.course });
    res.status(httpStatus.OK).json(teachers);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});
// Update a teacher but only admin or has cred-level of 4 or higher
teacherRoute.put(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      const user = await User.findById(req.body.userId).populate({
        path: "auth",
        model: "Auth",
      });
      if (req.user!.credLevel < 4 || user!.auth.trustLevel < 4) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const teacher = await Teacher.findById(req.params.id);
      await teacher!.updateOne({
        $set: req.body,
      });
      return res.status(httpStatus.OK).json("teacherが更新されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

// Delete a teacher but only admin or has cred-level of 4 or higher
teacherRoute.delete(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      const user = await User.findById(req.body.userId).populate({
        path: "auth",
        model: "Auth",
      });
      if (req.user!.credLevel < 4 || user!.auth.trustLevel < 4) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      const teacher = await Teacher.findById(req.params.id);
      await teacher!.deleteOne();
      return res.status(httpStatus.OK).json("teacherが削除されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

export default teacherRoute;
