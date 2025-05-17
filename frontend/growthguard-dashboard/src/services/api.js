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

export const fetchDailyData = async (field) => {
    const response = await axios.get(`${API_BASE_URL}daily/${field}`);
    return response.data;
};

// Helper function to format the timestamp
function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Format options for readability
    const options = {
        weekday: 'long', // e.g., "Saturday"
        year: 'numeric', // e.g., "2025"
        month: 'long',   // e.g., "May"
        day: 'numeric',  // e.g., "10"
        hour: '2-digit', // e.g., "08"
        minute: '2-digit', // e.g., "00"
        timeZoneName: 'short', // e.g., "GMT+7"
    };

    // Use the user's local timezone
    return date.toLocaleString(undefined, options);
}