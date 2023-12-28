import httpStatus from "http-status";
import multer from "multer";
import { Router as uploadRoute } from "../route";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // eslint-disable-line

uploadRoute.post("/", (req, res) => {
  try {
    return res
      .status(httpStatus.OK)
      .json({ success: true, message: "Upload success" });
  } catch (err) {
    console.log(err);
  }
});

export default uploadRoute;
