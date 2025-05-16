import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables
const result = dotenv.config({ path: '.env' });
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

const port = result.parsed.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
});