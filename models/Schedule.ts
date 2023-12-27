import mongoose from 'mongoose';
import Event from './Event';

export type ScheduleType = {
  reference: mongoose.Schema.Types.ObjectId;
  onModel: 'Room' | 'User' | 'Class';
  events: mongoose.Schema.Types.ObjectId[];
};

const ScheduleSchema = new mongoose.Schema({
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    enum: ['Room', 'User', 'Class'],
    required: true,
  },
  events: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }],
});
export default mongoose.model('Schedule', ScheduleSchema);