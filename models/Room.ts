import mongoose from "mongoose";

export type RoomType = {
  roomName: string;
  roomNumber?: number;
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
  status: {
    type: String,
    default: "",
  },
});

const Room = mongoose.model<RoomType>("Room", RoomSchema);

export default Room;
