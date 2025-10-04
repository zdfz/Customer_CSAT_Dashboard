const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Environment variables for security
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Google Sheets proxy endpoint
app.get('/api/sheets-data', async (_, res) => {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Customer Survey Questionnaire!A:ZZ?key=${GOOGLE_API_KEY}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const data = await response.json();

        // Forward Google Sheets status code to client for accurate error handling
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Serve the main page
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    // Server running
});