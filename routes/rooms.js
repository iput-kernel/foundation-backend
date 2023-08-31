const router = require('express').Router();
const Room = require('../models/Room');
const User = require('../models/User');

router.post("/", async (req,res) => {
    try{
        const newRoom = new Room(req.body);
        const user = await User.findById(req.body.userId);
        if(user.isAdmin || user.credLevel >= 4){
            const savedRoom = await newRoom.save();
            res.status(200).json(savedRoom);
        }else{
            return res.status(403).json("権限がありません。");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

//roomをすべて取得
router.get("/", async (req,res) => {
    try{
        const rooms = await Room.find();
        res.status(200).json(rooms);
    }catch(err){
        return res.status(500).json(err);
    }
});

//特定のroomを取得
router.get("/:id", async (req,res) => {
    try{
        const room = await Room.findById(req.params.id);
        return res.status(200).json(room);
    }catch(err){
        return res.status(403).json(err);
    }
});

//特定のroomを更新
router.put("/number/:number", async (req,res) => {
    try {
        const room = await Room.findOne({roomNumber: req.params.number});
        if (!room) {
            return res.status(404).json("room not found");
        }
        await room.updateOne({
            $set: req.body,
        });
        return res.status(200).json("roomが更新されました");
    } catch(err) {
        return res.status(500).json(err.message || "Something went wrong");
    }
});
        

// userが管理者、もしくは信用レベルが4以上の場合にroomを削除
router.delete("/:id", async (req,res) => {
    try{
        const room = await Room.findById(req.params.id);
        const user = await User.findById(req.body.userId);
        if(user.isAdmin || user.credLevel >= 4){
            await room.deleteOne();
            return res.status(200).json("roomが削除されました");
        }else{
            return res.status(403).json("権限がありません。");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

router.delete("/number/:number", async (req,res) => {
    try{
        const room = await Room.findOne({roomNumber: req.params.number});
        const user = await User.findById(req.body.userId);
        if(user.isAdmin || user.credLevel >= 4){
            await room.deleteOne();
            return res.status(200).json("roomが削除されました");
        }else{
            return res.status(403).json("権限がありません。");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});


module.exports = router;