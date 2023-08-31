const router = require('express').Router();

const Class = require('../models/Class');
const User = require('../models/User');

//クラス
router.post("/", async (req,res) => {
    const newClass = new Class(req.body);
    try{
        const savedClass = await newClass.save();
        res.status(200).json(savedClass);
    }catch(err){
        return res.status(500).json(err);
    }
});

router.put("/:id", async (req,res) => {
    try{
        const post = await Class.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("クラスが更新されました");
        }else{
            return res.status(403).json("クラスを更新できません");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

router.delete("/:id", async (req,res) => {
    try{
        const post = await Class.findById(req.params.id);
        const user = await User.findById(req.body.userId);
        if(user.isAdmin || user.credLevel > 5){
            await post.deleteOne();
            return res.status(200).json("クラスが削除されました");
        }else{
            return res.status(403).json("クラスを削除できません");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

//特定のクラスの取得
router.get("/:id", async (req,res) => {
    try{
        const classes = await Class.findById(req.params.id);
        return res.status(200).json(classes);
    }catch(err){
        return res.status(403).json(err);
    }
});

//クラスをすべて取得
router.get("/", async (req,res) => {
    try{
        const classes = await Class.find();
        return res.status(200).json(classes);
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;