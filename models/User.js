const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 16,
        unique: true
    },
    realnameFirst: {
        type: String,
        default: "",
        max: 32
    },
    realnameLast: {
        type: String,
        default: "",
        max: 32
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9_.+-]+@tks.iput.ac.jp/, 'ドメインはtks.iput.ac.jpである必要があります'],
        max: 319
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    profilePicture: {
        type: String,
        default: "",
    },
    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    grade:{
        type: Number,
        max: 10,
    },
    course:{
        type: String,
        max: 30,
        default: "",
    },
    classId:{
        type: String,
        max: 10,
    },
    class:{
        type: String,
        max: 4,
    },
    englishClass:{
        type: String,
        max: 4,
    },
    phone: {
        type: String,
        max: 20,
        default: "",
    },
    sex: {
        type: String,
        max: 8,
        default: "",
    },
    birthday: {
        type: Date,
        default: "",
    },
    major: {
        type: String,
        max: 30,
        default: "",
    },
    motherTongue: {
        type: String,
        max: 30,
        default: "日本語",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAnonymous: {
        type: Boolean,
        default: true,
    },
    isFirstTime: {
        type: Boolean,
        default: true,
    },
    credLevel: {
        type: Number,
        default: 2,
    },
    credToken: {
        type: Number,
        default: 3,
    },
    desc: {
        type: String,
        max: 128,
        default: "",
    },
    city: {
        type: String,
        max: 50,
    },
},
{timestamps: true}
);
module.exports = mongoose.model("User",UserSchema);