const router = require('express').Router();
const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Room = require('../models/Room');

// Create a Timetable
router.post('/', async (req, res) => {
    const { usedClass, weekSubjects, weekRooms } = req.body;

    try {
        const timetableSubjects = await Promise.all(weekSubjects.map(async (daySubjects) => {
            return await Promise.all(daySubjects.map(async (name) => {
                const subject = await Subject.findOne({ subjectName: name });
                if (!subject) {
                    throw new Error(`${name} という科目は存在しません`);
                }
                return subject._id;
            }));
        }));

        // Convert each day's room numbers to Room IDs
        const timetableRooms = await Promise.all(weekRooms.map(async (dayRooms) => {
            return await Promise.all(dayRooms.map(async (roomNumber) => {
                const room = await Room.findOne({ roomNumber: roomNumber });
                if (!room) {
                    throw new Error(`${roomNumber} という教室番号は存在しません`);
                }
                return room._id;
            }));
        }));

        const timetable = new Timetable({ usedClass, weekSubjects: timetableSubjects, weekRooms: timetableRooms });
        await timetable.save();
        res.status(201).json(timetable);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a Timetable by ID
router.get('/:id', async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id)
            .populate({
                path: 'weekSubjects',
                model: 'Subject'
            })
            .populate({
                path: 'weekRooms',
                model: 'Room'
            })
            .populate({
                path: 'usedClass',
                model: 'Class'
            });
        if (!timetable) {
            return res.status(404).json({ message: '指定されたIDの時間割は存在しません' });
        }
        res.status(200).json(timetable);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Timetables
router.get('/', async (req, res) => {
    try {
        const timetables = await Timetable.find()
            .populate({
                path: 'weekSubjects',
                model: 'Subject'
            })
            .populate({
                path: 'weekRooms',
                model: 'Room'
            })
            .populate({
                path: 'usedClass',
                model: 'Class'
            });
        res.status(200).json(timetables);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
