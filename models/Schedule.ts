import mongoose from 'mongoose';
import Event from './Event';

const ScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    enum: ['Room', 'User', 'Class'],
    required: true,
  },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});
export default mongoose.model('Schedule', ScheduleSchema);