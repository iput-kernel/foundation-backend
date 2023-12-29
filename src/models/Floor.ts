import mongoose from "mongoose";

export type FloorType = {
  floor: number;
  roomsId: mongoose.Types.ObjectId[];
};

const FloorSchema = new mongoose.Schema<FloorType>({
  floor: {
    type: Number,
    required: true,
  },
  roomsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
});

const Floor = mongoose.model<FloorType>("Floor", FloorSchema);

export default Floor;
