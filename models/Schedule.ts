import mongoose from 'mongoose';
import Event from './Event';

const ScheduleSchema = new mongoose.Schema({
  name: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

export default mongoose.model('Schedule', ScheduleSchema);