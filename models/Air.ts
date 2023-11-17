import mongoose from "mongoose";
export type AirType = {
  roomName: string;
  temp:number;
  humi:number;
  co2Level:number;
  createdAt: Date;
};

const AirSchema = new mongoose.Schema<AirType>({
  roomName: {
    type: String,
  },
  temp: {
    type: Number,
  },
  humi: {
    type: Number,
  },
  co2Level: {
    type: Number,
  },
  createdAt: {
    type: Date,
  }
});

const Air = mongoose.model<AirType>("Air", AirSchema);

export default Air;