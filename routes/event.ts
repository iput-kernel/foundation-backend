import { Types } from 'mongoose';
import express, { Request, Response } from 'express';
import { authenticateJWT } from '../jwtAuth';
import Event from '../models/Event';

import httpStatus from "http-status";

const router = express.Router();

router.put('/trust/:id', authenticateJWT, async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(httpStatus.UNAUTHORIZED).send('アカウントが認証されていません。');

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(httpStatus.NOT_FOUND).send('Event not found');

        event.trust.push(new Types.ObjectId(req.user.id));
        switch (true) {
            case req.user.credLevel <= 2:
                event.authenticity += 10;
                break;
            case req.user.credLevel == 3:
                event.authenticity += 30;
                break;
            default:
                event.authenticity = 100;
        }
        await event.save();

        res.send('Trust added successfully');
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Server error');
    }
});

router.put('/distrust/:id', authenticateJWT, async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(httpStatus.UNAUTHORIZED).send('アカウントが認証されていません。');

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(httpStatus.NOT_FOUND).send('Event not found');

        event.distrust.push(new Types.ObjectId(req.user.id));
        switch (true) {
            case req.user.credLevel <= 2:
                event.authenticity -= 10;
                break;
            case req.user.credLevel == 3:
                event.authenticity -= 30;
                break;
            default:
                event.authenticity = 0;
        }

        res.send('Distrust added successfully');
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Server error');
    }
});

export default router;