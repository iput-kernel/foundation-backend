import mongoose, { Document } from 'mongoose';

interface IEvent extends Document {
    name: string;
    startDate: Date;
    endDate: Date;
    authenticity: number;
    trust: mongoose.Types.ObjectId[];
    distrust: mongoose.Types.ObjectId[];
    description: string;
}

const EventSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    authenticity: { type: Number, min: 0, max: 100, default: 80},
    trust: [mongoose.Types.ObjectId],
    distrust: [mongoose.Types.ObjectId],
    place: String,
    description: String,
});


export default mongoose.model<IEvent>('Event', EventSchema);