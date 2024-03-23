{
  /*
import { InfluxDB, Point } from '@influxdata/influxdb-client';
   // InfluxDBの設定
const url = 'http://localhost:8086';
const token = 'YourInfluxDBToken';
const org = 'YourOrganization';
const bucket = 'YourBucket';

const client = new InfluxDB({ url, token });

const writeApi = client.getWriteApi(org, bucket);
writeApi.useDefaultTags({ host: 'host1' });

const point = new Point('temperature')
    .tag('location', 'office')
    .floatField('value', 23.7);

writeApi.writePoint(point);

writeApi
    .close()
    .then(() => {
        console.log('データ挿入完了');
    })
    .catch((e) => {
        console.error(e);
        console.log('データ挿入中にエラーが発生しました');
    });
*/
}

