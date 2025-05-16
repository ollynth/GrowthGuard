import express from 'express';
import dataRoutes from './routes/dataRoutes.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Register routes
app.use('/data', dataRoutes);

export default app;






// import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';

// import dotenv from 'dotenv';
// const result = dotenv.config({ path: '.env' });
// if (result.error) {
//     console.error('Error loading .env file:', result.error);
//     process.exit(1);
// }
// console.log('Loaded .env file:', result.parsed);

// const token = result.parsed.INFLUXDB_TOKEN;
// if (!token) {
//     console.error('Missing InfluxDB token.');
//     process.exit(1);
// }
// const influxURL = result.parsed.INFLUXDB_URL;

// async function main() {
//     const client = new InfluxDBClient({
//         host: influxURL,
//         token: token,
//         debug: true
//     });

//     let database = result.parsed.INFLUXDB_BUCKET;

//     // Query data
//     const query = `SELECT * FROM "plant_metrics" WHERE "temperature" IS NOT NULL LIMIT 10`;

//     try {
//         const rows = await client.query(query, database);

//         const resultArray = [];
//         for await (const row of rows) {
//             resultArray.push(row);
//         }

//         if (resultArray.length === 0) {
//             console.log('No data found for the given query.');
//         } else {
//             console.log('Query Results:');
//             console.log(resultArray);
           

//         }
//     } catch (error) {
//         console.error('Query failed:', error);
//     }



//     client.close();
// }

// main().catch(console.error);
