import mongoose from 'mongoose';
export type AirType = {
  temp: number;
  humi: number;
  co2Level: number;
  createdAt: Date;
};

const AirSchema = new mongoose.Schema<AirType>({
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
  },
});

const Air = mongoose.model<AirType>('Air', AirSchema);

export default Air;
