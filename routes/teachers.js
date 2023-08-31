const router = require('express').Router();
const Teacher = require('../models/Teacher');
const User = require('../models/User');

// Create a teacher but only admin or has cred-level of 4 or higher
router.post("/", async (req,res) => {
    try{
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if(user.isAdmin || user.trustLevel >= 4){
            const newTeacher = new Teacher(req.body);
            try{
                const savedTeacher = await newTeacher.save();
                res.status(200).json(savedTeacher);
            }catch(err){
                return res.status(500).json(err);
            }
        }else{
            return res.status(403).json("権限がありません。");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});
// Get all teachers
router.get("/", async (req,res) => {
    try{
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    }catch(err){
        return res.status(500).json(err);
    }
});
// Get a teacher by id
router.get("/course/:course", async (req,res) => {
    try{
        const teachers = await Teacher.find({course: req.params.course});
        res.status(200).json(teachers);
    }catch(err){
        return res.status(500).json(err);
    }
});
// Update a teacher but only admin or has cred-level of 4 or higher
router.put("/:id", async (req,res) => {
    try{
        const teacher = await Teacher.findById(req.params.id);
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
        const teacher = await Teacher.findById(req.params.id);
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