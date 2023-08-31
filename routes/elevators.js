const router = require("express").Router();
const Elevator = require("../models/Elevator");
const User = require("../models/User");

// Create Elevator
router.post("/", async (req,res) => {
    const newElevator = new Elevator(req.body);
    try{
        const savedElevator = await newElevator.save();
        res.status(200).json(savedElevator);
    }catch(err){
        return res.status(500).json(err);
    }
});

// Update Elevator by color
router.put("/:color", async (req,res) => {
    try{
        const elevator = await Elevator.findOne({color: req.params.color});
        if(elevator.color === req.body.color){
            await elevator.updateOne({
                $set: req.body,
            });
            return res.status(200).json("エレベーターが更新されました");
        }else{
            return res.status(403).json("エレベーターを更新できません");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

// Delete Elevator by id
router.delete("/:id", async (req,res) => {
    try{
        const elevator = await Elevator.findById(req.params.id);
        await elevator.deleteOne();
        return res.status(200).json("エレベーターが削除されました");
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;