import { InfluxDBClient } from '@influxdata/influxdb3-client';
import dotenv from 'dotenv';
const result = dotenv.config({ path: '.env' });
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

const token = result.parsed.INFLUXDB_TOKEN;
const influxURL = result.parsed.INFLUXDB_URL;
const bucket = result.parsed.INFLUXDB_BUCKET;
const ssid = result.parsed.SSID; // SSID for filtering data
const measurement = result.parsed.INFLUXDB_MEASUREMENT; // Measurement name


if (!token) {
    console.error('Missing InfluxDB token.');
    process.exit(1);
} 
if (!influxURL) {
    console.error('Missing InfluxDB URL.');
    process.exit(1);
}
if (!bucket) {
    console.error('Missing InfluxDB bucket.');
    process.exit(1);
}
if (!ssid) {
    console.error('Missing SSID.');
    process.exit(1);
}

const influx = new InfluxDBClient({
    host: influxURL,
    token: token,
    debug: true
});

export { influx, bucket as database, ssid, measurement };