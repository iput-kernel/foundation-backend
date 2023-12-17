import mongoose from "mongoose";

export type RoomType = {
  roomName: string;
  roomNumber?: number;
  seats?: number;
  airId?: mongoose.Schema.Types.ObjectId;
  status?: string;
};

const RoomSchema = new mongoose.Schema<RoomType>({
  roomName: {
    type: String,
    default: "教室",
  },
  roomNumber: {
    type: Number,
  },
  seats: {
    type: Number,
  },
  airId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Air",
  },
  status: {
    type: String,
    default: "",
  },
});

const Room = mongoose.model<RoomType>("Room", RoomSchema);

export default Room;
