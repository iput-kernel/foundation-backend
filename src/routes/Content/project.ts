import httpStatus from 'http-status';

import Project from '../../models/Content/Project';
import { Router } from 'express';

import { authenticateJWT, RequestWithUser } from '../../jwtAuth';

const projectRoute = Router();

projectRoute.post('/', authenticateJWT, 
  async (req:RequestWithUser , res) => {
    if (!req.user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send('アカウントが認証されていません。');
    }
    const newProject = new Project(req.body);
    try {
      const savedProject = await newProject.save();
      res.status(httpStatus.OK).json(savedProject);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);
