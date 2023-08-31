const router = require('express').Router();
const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');
const Week = require('../models/Week');

// Create a Week timetable
router.post('/', async (req, res) => {
    const { usedClass,weekSubjects } = req.body; // weekSubjects should be an array of arrays, each inner array representing a day's subjects.

    try {
        // Convert each day's subject names to Timetable IDs
        const days = await Promise.all(weekSubjects.map(async (daySubjects) => {
            const subjectIds = await Promise.all(daySubjects.map(async (name) => {
                const subject = await Subject.findOne({ subjectName: name });
                if (!subject) {
                    throw new Error(`${name} という科目は存在しません`);
                }
                return subject._id;
            }));

            // Find an existing Timetable with the same subjectIds or create a new one
            let timetable = await Timetable.findOne({ subjectIds: { $all: subjectIds, $size: subjectIds.length } });
            if (!timetable) {
                timetable = new Timetable({ subjectIds });
                await timetable.save();
            }
            return timetable._id;
        }));

        // Create a new Week
        const week = new Week({ usedClass,days });
        await week.save();
        res.status(201).json(week);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a Week timetable by ID
router.get('/:id', async (req, res) => {
    try {
        const week = await Week.findById(req.params.id).populate({
            path: 'days',
            model: 'Timetable',
            populate: {
                path: 'subjectIds',
                model: 'Subject'
            }
        });
        if (!week) {
            return res.status(404).json({ message: '指定されたIDの時間割は存在しません' });
        }
        res.status(200).json(week);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Week timetables
router.get('/', async (req, res) => {
    try {
        const weeks = await Week.find()
            .populate({
                path: 'days',
                model: 'Timetable',
                populate: {
                    path: 'subjectIds',
                    model: 'Subject'
                }
            });
        res.status(200).json(weeks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get a Week timetable by usedClass ID
router.get('/class/:classId', async (req, res) => {
    try {
        const week = await Week.findOne({ usedClass: req.params.classId })
            .populate({
                path: 'days',
                model: 'Timetable',
                populate: {
                    path: 'subjectIds',
                    model: 'Subject'
                }
            });

        if (!week) {
            return res.status(404).json({ message: '指定されたクラスIDの時間割は存在しません' });
        }

        res.status(200).json(week);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




module.exports = router;

