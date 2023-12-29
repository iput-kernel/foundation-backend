import httpStatus from "http-status";
import Teacher from "../models/Teacher";
import User from "../models/User";
import { Router } from "express";

const teacherRoute = Router();

// Create a teacher but only admin or has cred-level of 4 or higher
teacherRoute.post("/", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (user!.isAdmin || user!.trustLevel >= 4) {
      const newTeacher = new Teacher(req.body);
      try {
        const savedTeacher = await newTeacher.save();
        res.status(httpStatus.OK).json(savedTeacher);
      } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    } else {
      return res.status(httpStatus.FORBIDDEN).json("権限がありません。");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});
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
teacherRoute.put("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (user!.isAdmin || user!.trustLevel >= 4) {
      await teacher!.updateOne({
        $set: req.body,
      });
      return res.status(httpStatus.OK).json("teacherが更新されました");
    } else {
      return res.status(httpStatus.FORBIDDEN).json("権限がありません。");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Delete a teacher but only admin or has cred-level of 4 or higher
teacherRoute.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (user!.isAdmin || user!.trustLevel >= 4) {
      await teacher!.deleteOne();
      return res.status(httpStatus.OK).json("teacherが削除されました");
    } else {
      return res.status(httpStatus.FORBIDDEN).json("権限がありません。");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default teacherRoute;
