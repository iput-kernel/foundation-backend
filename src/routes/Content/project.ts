import httpStatus from 'http-status';

import Project from '../../models/Content/Project';
// import multer from 'multer';
import { Router } from 'express';

import { authenticateJWT, RequestWithUser } from '../../jwtAuth';

/* 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 'uploads/' はサーバー上の画像を保存するディレクトリ
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // ファイル名の衝突を避けるためにタイムスタンプを追加
  }
});

 const upload = multer({ storage: storage });
*/

const projectRoute = Router();

projectRoute.post('/', authenticateJWT, 
  async (req:RequestWithUser , res) => {
    if (!req.user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send('アカウントが認証されていません。');
    }
    const newProjectData = {
      ...req.body,
      createdUser: req.user.id
    };
    const newProject = new Project(newProjectData);
    try {
      const savedProject = await newProject.save();
      res.status(httpStatus.OK).json(savedProject);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

projectRoute.get('/',
  async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(httpStatus.OK).json(projects);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

projectRoute.put('/edit/:id',
  authenticateJWT, 
  async (req:RequestWithUser, res) => {
    try {
      if (!req.user){
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send('アカウントが認証されていません。');
      }
      const currentProject = await Project.findById(req.params.id);
      if (currentProject!.createdUser! === req.user.id) {
        await Project!.updateOne({
          $set: req.body,
        });
        return res.status(httpStatus.OK).json('プロジェクトが更新されました');
      } else {
        return res.status(httpStatus.FORBIDDEN).json('プロジェクトを更新できません');
      }

    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

projectRoute.put('/join/:id',
  authenticateJWT,
  async (req:RequestWithUser, res) => {
    try {
      if (!req.user){
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send('アカウントが認証されていません。');
      }
      const currentProject = await Project.findById(req.params.id);
      if (currentProject!.membersId.includes(req.user.id)) {
        return res.status(httpStatus.FORBIDDEN).json('すでに参加しています');
      } else {
        await Project!.updateOne({
          $push: { members: req.user.id },
        });
        return res.status(httpStatus.OK).json('プロジェクトに参加しました');
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);