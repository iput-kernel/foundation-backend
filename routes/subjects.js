const httpStatus = require("http-status");

const router = require("express").Router();
const Subject = require("../models/Subject");

//Subject作成
router.post("/", async (req, res) => {
  const newSubject = new Subject(req.body);
  try {
    const savedSubject = await newSubject.save();
    res.status(httpStatus.OK).json(savedSubject);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//Subject更新
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({
      $set: req.body,
    });
    return res.status(httpStatus.OK).json("Subjectを編集しました。");
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//Subject削除
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();
    return res.status(httpStatus.OK).json("Subjectを削除しました。");
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Subjectを削除 subjectNameで
router.delete("/name/:subjectName", async (req, res) => {
  try {
    const subject = await Subject.findOne({
      subjectName: req.params.subjectName,
    });
    await subject.deleteOne();
    return res.status(httpStatus.OK).json("Subjectを削除しました。");
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//全てのSubject取得
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    return res.status(httpStatus.OK).json(subjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//任意のgradeのSubject取得
router.get("/grade/:grade", async (req, res) => {
  try {
    const subjects = await Subject.find({ grade: req.params.grade });
    return res.status(httpStatus.OK).json(subjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

module.exports = router;
