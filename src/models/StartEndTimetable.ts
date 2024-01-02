import mongoose from "mongoose";

type StartEndTimeSchemaType = {
    startTime: Date;
    endTime: Date;
};

// 授業スキーマの定義
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