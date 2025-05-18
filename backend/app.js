import express from 'express';
import cors from 'cors';
import dataRoutes from './routes/dataRoutes.js';
const app = express();

// Enable CORS for all routes
app.use(cors());
// Middleware to parse JSON
// app.use(express.json());

// Register routes
app.use('/data', dataRoutes);

export default app;