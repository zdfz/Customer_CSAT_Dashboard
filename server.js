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
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyAGJclt8C5wbo0qivboVpDiRLlGcOFWd1I';
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin123';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1RfmLuP_XoQ_yxhMnYVnCOI_b7jUEP_UuAbabtCIy-Ns';

// Simple session storage (in production, use Redis or database)
const sessions = new Map();

// Generate session token
function generateSessionToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Authentication endpoint
app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    
    if (password === DASHBOARD_PASSWORD) {
        const token = generateSessionToken();
        sessions.set(token, { 
            authenticated: true, 
            timestamp: Date.now() 
        });
        
        res.json({ 
            success: true, 
            token: token 
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid password' 
        });
    }
});

// Middleware to check authentication
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !sessions.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const session = sessions.get(token);
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (Date.now() - session.timestamp > oneDay) {
        sessions.delete(token);
        return res.status(401).json({ error: 'Session expired' });
    }
    
    next();
}

// Protected Google Sheets proxy endpoint
app.get('/api/sheets-data', requireAuth, async (req, res) => {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Customer Survey Questionnaire!A:AH?key=${GOOGLE_API_KEY}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;
        
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Error fetching sheets data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});