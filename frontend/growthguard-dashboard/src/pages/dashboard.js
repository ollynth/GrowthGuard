import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Chart from '../components/Chart';
import { fetchLatestData, fetchDailyData, fetchWeeklyData } from '../services/api';
import './dashboard.css';

const Dashboard = () => {
    const [latestData, setLatestData] = useState(null);
    const [dailyData, setDailyData] = useState({
        temperature: [],
        humidity: [],
        soilMoisture: []
    });
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('daily'); // Default to daily view
    const [waterStatus, setWaterStatus] = useState(''); // Add state for waterStatus

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch latest data
                const latest = await fetchLatestData();
                setLatestData(latest);

                // Update waterStatus based on the fetched data
                if (latest.water_status === 1) {
                    setWaterStatus("Need Water");
                } else if (latest.water_status === 0) {
                    setWaterStatus("Fine Condition");
                } else {
                    setWaterStatus("Unknown Status");
                }

                // Fetch data based on the selected view type
                if (viewType === 'daily') {
                    const tempData = await fetchDailyData('temperature');
                    const humidityData = await fetchDailyData('humidity');
                    const soilMoistureData = await fetchDailyData('soil_moisture');

                    setDailyData({
                        temperature: tempData,
                        humidity: humidityData,
                        soilMoisture: soilMoistureData
                    });
                } else if (viewType === 'weekly') {
                    const tempData = await fetchWeeklyData('temperature');
                    const humidityData = await fetchWeeklyData('humidity');
                    const soilMoistureData = await fetchWeeklyData('soil_moisture');

                    setDailyData({
                        temperature: tempData,
                        humidity: humidityData,
                        soilMoisture: soilMoistureData
                    });
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();

        // Polling: Fetch data every 15 minutes
        const interval = setInterval(fetchData, 15 * 60 * 1000); // 15 minutes
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [viewType]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="main-container">
            <Header />
            <div className="data-container">
                {/* Current Status */}
                <h2 className="label">Latest Detection</h2>
                <div className="status-card">
                    <Card title="Notification" value={waterStatus} />
                </div>
                <div className="card-grid">
                    <Card title="Date & Time" value={`${latestData?.time}`} icon="📅" />
                    <Card title="Temperature" value={`${latestData?.temperature || 0}°C`} icon="🌡️" />
                    <Card title="Humidity" value={`${latestData?.humidity || 0}%`} icon="💧" />
                    <Card title="Soil Moisture" value={`${latestData?.soil_moisture || 0}%`} icon="🌱" />
                </div>

                <h2 className="label">Analytics</h2>
                {/* View Type Toggle */}
                <div className="view-toggle">
                    <label>
                        <input
                            type="radio"
                            name="view-type"
                            value="daily"
                            checked={viewType === 'daily'}
                            onChange={() => setViewType('daily')}
                        />
                        Daily
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="view-type"
                            value="weekly"
                            checked={viewType === 'weekly'}
                            onChange={() => setViewType('weekly')}
                        />
                        Weekly
                    </label>
                </div>

                {/* Analytics */}
                <div className="charts-container">
                    <Chart data={dailyData.temperature} title="Temperature" />
                    <Chart data={dailyData.humidity} title="Humidity" />
                    <Chart data={dailyData.soilMoisture} title="Soil Moisture" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;