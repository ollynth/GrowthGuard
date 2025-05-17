import { influx, database, ssid, measurement } from '../utils/influxDbClient.js';

// Helper function to query all data
async function getAllData() {
    const query = `SELECT * FROM "plant_metrics" ORDER BY time DESC`;
    const result = [];
    try {
        const rows = await influx.query(query, database);
        for await (const row of rows) {
            result.push(row);
        }
        // If no data is returned, throw an error
        if (result.length === 0) {
            throw new Error('No data found for the query.');
        }
        return result;
    } catch (error) {
        console.error('Error fetching all data:', error.message || error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Helper function to query specific fields -- latest data
async function queryFieldLatest() {
    const query = `
        SELECT  *
        FROM "plant_metrics" 
        WHERE time >= now() - interval '1 day'
        ORDER BY time DESC 
        LIMIT 1
    `;
    try {
        const rows = await influx.query(query, database);
        const result = [];
        for await (const row of rows) {
            result.push(row);
        }
        // If no data is returned, throw an error
        if (result.length === 0) {
            throw new Error(`No data found.`);
        }
        return result[0]; // Return the first (and only) row
    } catch (error) {
        console.error(`Error fetching latest data.`, error.message || error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Helper function to query all data from a specific field -- for DAILY statistics
async function queryFieldDaily(field) {
    const query = `
        SELECT time, ${field} 
        FROM "plant_metrics" 
        WHERE time >= now() - interval '1 day' 
          AND ${field} IS NOT NULL 
          AND "device" IN ('ESP32') 
          AND "SSID" = '${ssid}' 
        ORDER BY time DESC
    `;
    const result = [];
    try {
        const rows = await influx.query(query, database);
        for await (const row of rows) {
            result.push(row);
        }
        // If no data is returned, throw an error
        if (result.length === 0) {
            throw new Error(`No daily data found for field: ${field}`);
        }
        return result;
    } catch (error) {
        console.error(`Error fetching daily data for field ${field}:`, error.message || error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// for testing purposes
async function queryField(field) {
    const query = `SELECT time, ${field} FROM "plant_metrics" 
                   WHERE ${field} IS NOT NULL
                   AND "device" IN ('ESP32') 
                   AND "SSID" = '${ssid}'
                   ORDER BY time DESC `;

    const result = [];
    const rows = await influx.query(query, database);
    for await (const row of rows) {
        result.push(row);
    }
    return result;
}

export { getAllData, queryFieldLatest, queryFieldDaily, queryField };