const router = require('express').Router();
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

// Create a teacher but only admin or has cred-level of 4 or higher
router.post('/', async (req, res) => {
    const { usedClass, dayOfWeek, subjectNames } = req.body;

    try {
        // Convert subject names to IDs
        const subjectIds = await Promise.all(subjectNames.map(async (name) => {
            const subject = await Subject.findOne({ subjectName: name });
            if (!subject) {
                throw new Error(`${name} という科目は存在しません`);
            }
            return subject._id;
        }));

        // Create a new Timetable
        const timetable = new Timetable({ usedClass, dayOfWeek, subjectIds });
        await timetable.save();
        res.status(201).json(timetable);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all teachers

router.get('/', async (req, res) => {
    try {
        const timetables = await Timetable.find().populate('subjectIds');
        res.json(timetables);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a teacher by id
router.get("/course/:course", async (req,res) => {
    try{
        const teachers = await Timeline.find({course: req.params.course});
        res.status(200).json(teachers);
    }catch(err){
        return res.status(500).json(err);
    }
});
// Update a teacher but only admin or has cred-level of 4 or higher
router.put("/:id", async (req,res) => {
    try{
        const teacher = await Timeline.findById(req.params.id);
        const user = User.findById(req.body.userId);
        if(user.isAdmin || userId.trustLevel >= 4){
            await teacher.updateOne({
                $set: req.body,
            });
            return res.status(200).json("teacherが更新されました");
        }else{
            return res.status(403).json("権限がありません。");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});


// Delete a teacher but only admin or has cred-level of 4 or higher
router.delete("/:id", async (req,res) => {
    try{
        const teacher = await Timeline.findById(req.params.id);
        const user = await User.findById(req.body.userId);
        if(user.isAdmin || user.trustLevel >= 4){
            await teacher.deleteOne();
            return res.status(200).json("teacherが削除されました");
        }else{
            return res.status(403).json("権限がありません。");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;
