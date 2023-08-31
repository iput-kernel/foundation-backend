const router = require('express').Router();
const User = require('../models/User');

router.get("/:id", async (req,res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt,...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        return res.status(500).json(err);
    }
});

router.put("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("アカウントが更新されました");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res
            .status(403)
            .json("アカウントを更新できません");
    }
});

router.delete("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("アカウントが削除されました");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res
            .status(403)
            .json("アカウントを削除できません");
    }
});

//フォロー
router.put("/:id/follow", async (req,res) => {
    //bodyのほうが自分 paramsのほうが相手
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $push: {followers: req.body.userId}
                });
                await currentUser.updateOne({
                    $push: {followings: req.params.id}
                });
                res.status(200).json("フォローしました");
            }else{
                res.status(403).json("フォロー済みです");
            }

        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("自分をフォローできません");
    }
});

//フォロー解除
router.put("/:id/unfollow", async (req,res) => {
    //bodyのほうが自分 paramsのほうが相手
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //フォロワーに存在したらフォローを解除できる
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({
                    $pull: {followers: req.body.userId}
                });
                await currentUser.updateOne({
                    $pull: {followings: req.params.id}
                });
                res.status(200).json("フォローを解除しました");
            }else{
                res.status(403).json("フォローを解除済みです。");
            }

        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("自分をフォロー解除できません");
    }
});


module.exports = router;