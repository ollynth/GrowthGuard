// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/data/';

export const fetchLatestData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}latest`);
        const data = response.data;

        // Convert the timestamp to a readable format
        const formattedTime = formatDate(data.time);

        // Return the data with the formatted time
        return { ...data, time: formattedTime };
    } catch (error) {
        console.error('Error fetching latest data:', error.message);
        throw error;
    }
};

export const fetchWeeklyData = async (field) => {
    try {
        const response = await axios.get(`${API_BASE_URL}weekly/${field}`);
        const data = response.data;
        const transformedData = calculateWeeklyAverages(data, field);

        return transformedData;
    } catch (error) {
        console.error(`Error fetching daily ${field} data:`, error.message);
        throw error;
    }
};

export const fetchDailyData = async (field) => {
    try {
        const response = await axios.get(`${API_BASE_URL}daily/${field}`);
        const data = response.data;

        const transformedData = calculateDailyAverages(data, field);

        return transformedData;
    } catch (error) {
        console.error(`Error fetching hourly ${field} data:`, error.message);
        throw error;
    }
};

// Helper function to calculate daily averages fro weekly report
function calculateWeeklyAverages(data, field) {
    const dailyAverages = {};

    // Group data by date and calculate averages
    data.forEach((item) => {
        const date = new Date(item.time).toLocaleDateString(); // Get the date part
        if (!dailyAverages[date]) {
            dailyAverages[date] = {
                date,
                sum: 0,
                count: 0,
            };
        }
        dailyAverages[date].sum += item[field];
        dailyAverages[date].count++;
    });

    // Calculate averages and format the result
    const result = Object.values(dailyAverages).map((entry) => ({
        date: entry.date,
        value: entry.sum / entry.count, // Average value
    }));

    return result;
}

function calculateDailyAverages(data, field) {
    const hourlyAverages = {};

    // Group data by hour and calculate averages
    data.forEach((item) => {
        const date = new Date(item.time);
        const hour = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`; // Format as YYYY-MM-DD HH:00

        if (!hourlyAverages[hour]) {
            hourlyAverages[hour] = {
                date: hour,
                sum: 0,
                count: 0,
            };
        }
        hourlyAverages[hour].sum += item[field];
        hourlyAverages[hour].count++;
    });

    // Calculate averages and format the result
    const result = Object.values(hourlyAverages).map((entry) => ({
        date: entry.date,
        value: entry.sum / entry.count, // Average value
    }));

    return result;
}

// Helper function to format the timestamp
function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Format options for readability
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    };

    // Use the user's local timezone
    return date.toLocaleString(undefined, options);
}