import { Router } from 'express';
import httpStatus from 'http-status';
import multer from 'multer';

import Project from '../../models/Content/Project';
import minioClient from '../../utils/minioClient';

import { authenticateJWT, RequestWithUser } from '../../jwtAuth';

const projectRoute = Router();

projectRoute.post('/', authenticateJWT,
 multer().single('thumbnail'), 
  async (req: RequestWithUser, res) => {
    try {
      if (!req.user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send('アカウントが認証されていません。');
      }
      const file = req.file;
      if (!file) {
        return res.status(httpStatus.BAD_REQUEST).send('ファイルが提供されていません。');
      }

      const bucketName = 'thumbnails';
      const fileName = `${Date.now()}-${file.originalname}`;
      const metaData = {
        'Content-Type': file.mimetype
      };

      minioClient.putObject(bucketName, fileName, file.buffer, file.size, metaData, function(err) {
        if (err) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('ファイルのアップロードに失敗しました。');
        }

        const filePath = `http://minio:9000/${bucketName}/${fileName}`;

        const newProjectData = {
          ...req.body,
          thumbnailPath: filePath,
          createdUser: req.user!.id
        };

        const newProject = new Project(newProjectData);

        newProject.save()
          .then(savedProject => {
            res.status(httpStatus.OK).json(savedProject);
          })
          .catch(err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
          });
      });
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

export default projectRoute;