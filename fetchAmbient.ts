require('dotenv').config();
import axios from 'axios';
import * as fs from 'fs';

interface AmbientData {
    [key: string]: number | string;
}

interface ClassroomInfo {
    number: string;
    type: string;
}

interface ClassroomMapping {
    [key: string]: ClassroomInfo;
}

interface ChannelInfo {
    id: string;
    key: string;
}

interface OrganizedData {
    temp?: number;
    humi?: number;
    co2Level?: number;
    createdAt?: string;
    [key: string]: number | string | undefined;
}
const channels:ChannelInfo[] = [
    { id: process.env.CHANNEL1_ID!, key: process.env.CHANNEL1_KEY! },
    { id: process.env.CHANNEL2_ID!, key: process.env.CHANNEL2_KEY! },
    { id: process.env.CHANNEL3_ID!, key: process.env.CHANNEL3_KEY! }
];

const channelMappings: ClassroomMapping[] = [
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

const getAmbientData = async (channelId: string, readKey: string) => {
    const url = `https://ambidata.io/api/v2/channels/${channelId}/data`;
    try {
        const response = await axios.get(url, {
            params: {
                readKey: readKey,
                n: '6',
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data from Ambient:', error);
        return null;
    }
};


const organizeData = (data: AmbientData[], mapping: ClassroomMapping): { [key: string]: OrganizedData } => {
    const organizedData: { [key: string]: OrganizedData } = {};

    data.forEach(item => {
        Object.keys(item).forEach(key => {
            if (key !== 'created' && mapping[key]) {
                const classroomInfo = mapping[key];
                const classroomName = classroomInfo.number;
                const dataType = classroomInfo.type.toLowerCase();

                if (!organizedData[classroomName]) {
                    organizedData[classroomName] = {};
                }

                organizedData[classroomName][dataType] = item[key] as number;
                if (!organizedData[classroomName].createdAt) {
                    organizedData[classroomName].createdAt = item.created as string;
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
  
processAllChannels()