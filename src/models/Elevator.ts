import mongoose from 'mongoose';

export type ElevatorType = {
  name: string;
  color: string;
  stops: number[];
};

const ElevatorSchema = new mongoose.Schema<ElevatorType>({
  name: {
    type: String,
    default: '',
  },

  color: {
    type: String,
    default: '',
  },

  stops: {
    type: [Number],
    default: [],
  },
});

const Elevator = mongoose.model<ElevatorType>('Elevator', ElevatorSchema);

export default Elevator;
