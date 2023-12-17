import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    place: String,
    description: String,
});

export default mongoose.model('Event', EventSchema);