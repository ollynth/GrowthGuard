import express from 'express';
import { getAllData, queryFieldLatest, queryFieldDaily, queryField } from '../controllers/dataControllers.js';

const router = express.Router();

// GET /data/all
router.get('/all', async (req, res) => {
    try {
        const data = await getAllData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching all data:', error);
        res.status(500).json({ error: 'Failed to fetch all data' });
    }
});

// GET /data/latest
router.get('/latest', async (req, res) => {
    try {
        const data = await queryFieldLatest();
        res.json(data);
    } catch (error) {
        console.error('Error fetching latest data:', error.message);
        res.status(404).json({ error: error.message });
    }
});

//TODO : implement daily data fetching
// GET /data/daily/:field
router.get('/daily/:field', async (req, res) => {
    const { field } = req.params;
    try {
        const data = await queryFieldDaily(field);
        res.json(data);
    } catch (error) {
        console.error(`Error fetching daily data for field ${field}:`, error.message);
        res.status(404).json({ error: error.message });
    }
});

// GET /data/temperature
router.get('/temperature', async (req, res) => {
    try {
        const data = await queryField('temperature');
        res.json(data);
    } catch (error) {
        console.error('Error fetching temp data:', error);
        res.status(500).json({ error: 'Failed to fetch temp data' });
    }
});

// GET /data/humidity
router.get('/humidity', async (req, res) => {
    try {
        const data = await queryField('humidity');
        res.json(data);
    } catch (error) {
        console.error('Error fetching humidity data:', error);
        res.status(500).json({ error: 'Failed to fetch humidity data' });
    }
});

// GET /data/soil_moisture
router.get('/soil_moisture', async (req, res) => {
    try {
        const data = await queryField('soil_moisture');
        res.json(data);
    } catch (error) {
        console.error('Error fetching soil moisture data:', error);
        res.status(500).json({ error: 'Failed to fetch soil moisture data' });
    }
});





export default router;