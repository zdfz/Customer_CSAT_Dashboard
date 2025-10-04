# Customer Survey Dashboard

A comprehensive analytics dashboard for customer satisfaction surveys with real-time data visualization and insights.

## Features

✅ **Real-time Analytics** - Live data from Google Sheets integration  
✅ **NPS Tracking** - Net Promoter Score calculation and visualization  
✅ **Customer Segmentation** - Analysis by service type and account manager  
✅ **Quarter-based Filtering** - Q1, Q2, Q3 data filtering with automatic completion tracking  
✅ **Question Satisfaction Breakdown** - Detailed analysis of 8 survey categories  
✅ **Responsive Design** - Modern, mobile-friendly interface  
✅ **API Keys Protected** - Server-side environment variables  
✅ **Mock Data Fallback** - Works offline with sample data  

## Production Deployment on Netlify

### 1. Environment Variables
Set these in your Netlify dashboard under Site Settings > Environment Variables:
```
GOOGLE_API_KEY=your_google_api_key
SPREADSHEET_ID=your_spreadsheet_id
```

### 2. Build Settings
- **Build command**: `npm install`
- **Publish directory**: `.`
- **Functions directory**: `netlify/functions`

### 3. Deploy Steps
```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Production ready deployment"
git push origin main

# 2. Connect repository to Netlify
# 3. Set environment variables in Netlify dashboard
# 4. Deploy automatically on push
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update environment variables:**
   Edit `.env` file with your actual credentials:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   SPREADSHEET_ID=your_spreadsheet_id_here
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Access dashboard:**
   Open http://localhost:3000

## Architecture

- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Backend**: Netlify Functions for serverless API endpoints  
- **Data Source**: Google Sheets API integration
- **Styling**: Modern CSS with custom properties and responsive design

## API Endpoints

- `/.netlify/functions/sheets-data` - Fetches survey data from Google Sheets

## What's Included

- **NPS Dashboard** - Complete Net Promoter Score analytics
- **CSAT Summary** - Customer satisfaction metrics and trends
- **Customer Status** - Completion tracking and pending customers
- **Account Manager Performance** - Individual manager analytics
- **Question Satisfaction** - Detailed breakdown of survey responses
- **Service Type Analysis** - Performance by service categories
- **Real-time Updates** - Live data synchronization
- **Error Handling** - Graceful fallbacks and user feedback

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Important Notes

⚠️ **Production Ready** - Optimized for Netlify deployment  
⚠️ **Environment Variables** - Never commit .env file to repository  
⚠️ **HTTPS Required** - Google Sheets API requires secure connections in production