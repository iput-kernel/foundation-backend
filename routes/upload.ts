import { Router } from "express";
import httpStatus from "http-status";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", (req, res) => {
  try {
    return res
      .status(httpStatus.OK)
      .json({ success: true, message: "Upload success" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
