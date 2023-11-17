"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const channels = [
    { id: process.env.CHANNEL1_ID, key: process.env.CHANNEL1_KEY },
    { id: process.env.CHANNEL2_ID, key: process.env.CHANNEL2_KEY },
    { id: process.env.CHANNEL3_ID, key: process.env.CHANNEL3_KEY }
];
const channelMappings = [
    // 1st Channel Mapping
    {
        d1: { number: '371', type: 'temp' },
        d2: { number: '371', type: 'humi' },
        d3: { number: '371', type: 'co2Level' },
        d4: { number: '374', type: 'co2Level' },
        d5: { number: '364', type: 'co2Level' },
        d6: { number: '361', type: 'co2Level' },
        d7: { number: '351', type: 'co2Level' },
        d8: { number: '354', type: 'co2Level' },
    },
    // 2nd Channel Mapping
    {
        d1: { number: '251', type: 'temp' },
        d2: { number: '251', type: 'humi' },
        d3: { number: '251', type: 'co2Level' },
        d4: { number: '353', type: 'co2Level' },
        d5: { number: '257', type: 'co2Level' },
        d6: { number: '277', type: 'co2Level' },
        d7: { number: '271', type: 'co2Level' },
        d8: { number: '313', type: 'co2Level' },
    },
    // 3rd Channel Mapping
    {
        d1: { number: '341', type: 'temp' },
        d2: { number: '341', type: 'humi' },
        d3: { number: '341', type: 'co2Level' },
        d4: { number: '342', type: 'co2Level' },
        d5: { number: '345', type: 'co2Level' },
        d6: { number: '311', type: 'co2Level' },
        d7: { number: '252', type: 'co2Level' },
        d8: { number: '274', type: 'co2Level' },
    }
];
const getAmbientData = async (channelId, readKey) => {
    const url = `https://ambidata.io/api/v2/channels/${channelId}/data`;
    try {
        const response = await axios_1.default.get(url, {
            params: {
                readKey: readKey,
                n: '6',
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching data from Ambient:', error);
        return null;
    }
};
const organizeData = (data, mapping) => {
    const organizedData = {};
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            if (key !== 'created' && mapping[key]) {
                const classroomInfo = mapping[key];
                const classroomName = classroomInfo.number;
                const dataType = classroomInfo.type.toLowerCase();
                if (!organizedData[classroomName]) {
                    organizedData[classroomName] = {};
                }
                organizedData[classroomName][dataType] = item[key];
                if (!organizedData[classroomName].createdAt) {
                    organizedData[classroomName].createdAt = item.created;
                }
            }
        });
    });
    return organizedData;
};
const processAllChannels = async () => {
    let allMergedData = {};
    for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        const mapping = channelMappings[i];
        const data = await getAmbientData(channel.id, channel.key);
        if (data) {
            const organizedData = organizeData(data, mapping);
            allMergedData = { ...allMergedData, ...organizedData };
        }
    }
    const filename = 'processedData.json';
    fs.writeFileSync(filename, JSON.stringify(allMergedData, null, 2), 'utf8');
    console.log(`File has been saved as ${filename}.`);
};
processAllChannels();
