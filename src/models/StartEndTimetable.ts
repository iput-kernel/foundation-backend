import mongoose from "mongoose";

type StartEndTimeSchemaType = {
    startTime: Date;
    endTime: Date;
};

const StartEndTimeSchema = new mongoose.Schema<StartEndTimeSchemaType>({
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    }
});

const StartEndTime = mongoose.model<StartEndTimeSchemaType>("StartEndTimeSchema", StartEndTimeSchema);

export default StartEndTime;