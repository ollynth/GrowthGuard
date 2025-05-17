import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Chart from '../components/Chart';
import { fetchLatestData, fetchDailyData } from '../services/api';
import './dashboard.css';

const Dashboard = () => {
    const [latestData, setLatestData] = useState(null);
    const [dailyData, setDailyData] = useState({
        temperature: [],
        humidity: [],
        soilMoisture: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch latest data
                const latest = await fetchLatestData();
                setLatestData(latest);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching latest data:', error);
                setLoading(false);
            }

            try {               
                // Fetch daily data for each field
                const tempData = await fetchDailyData('temperature');
                const humidityData = await fetchDailyData('humidity');
                const soilMoistureData = await fetchDailyData('soil_moisture');

                setDailyData({
                    temperature: tempData,
                    humidity: humidityData,
                    soilMoisture: soilMoistureData
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching daily data:', error);
                setLoading(false);
            }
        };

        fetchData();

        // Polling: Fetch data every 15 minutes
        const interval = setInterval(fetchData, 15 * 60 * 1000); // 15 minutes
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="main-container">
            <Header />
            <div className="data-container">
                {/* Current Status */}
                <h2 className="label">Latest Detection</h2>
                <div className="card-grid">
                    <Card title="Date & Time" value={`${latestData?.time}`} icon="📅" />
                    <Card title="Temperature" value={`${latestData?.temperature || 0}°C`} icon="🌡️" />
                    <Card title="Humidity" value={`${latestData?.humidity || 0}%`} icon="💧" />
                    <Card title="Soil Moisture" value={`${latestData?.soil_moisture || 0}%`} icon="🌱" />
                </div>

                {/* Analytics */}
                <div className="charts-container">
                    <h2 className="label">Analytics</h2>
                    <Chart data={dailyData.temperature} title="Daily Temperature" />
                    <Chart data={dailyData.humidity} title="Daily Humidity" />
                    <Chart data={dailyData.soilMoisture} title="Daily Soil Moisture" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;