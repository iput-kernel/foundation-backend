import mongoose, { Document } from 'mongoose';

interface IEvent extends Document {
    name: string;
    startDate: Date;
    endDate: Date;
    authenticity: number;
    feedback: mongoose.Types.ObjectId[];
    description: string;
}

const EventSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    authenticity: Number,
    feedback: [mongoose.Types.ObjectId],
    description: String,
});

export default mongoose.model<IEvent>('Event', EventSchema);