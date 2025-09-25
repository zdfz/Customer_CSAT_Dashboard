# Secure CSAT Dashboard

A secure customer satisfaction dashboard with proper authentication and API key protection.

## Security Improvements

✅ **API Keys Protected** - Moved to server-side environment variables  
✅ **Real Authentication** - Backend session-based auth instead of client-side password  
✅ **Environment Variables** - Sensitive data in .env file (not committed)  
✅ **Session Management** - Proper token-based authentication  

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update environment variables:**
   Edit `.env` file with your actual credentials:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   DASHBOARD_PASSWORD=your_secure_password_here
   SPREADSHEET_ID=your_spreadsheet_id_here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access dashboard:**
   Open http://localhost:3000

## What Changed

**Before (Insecure):**
- API key visible in browser source code
- Hardcoded password in JavaScript
- No real security

**After (Secure):**
- API key stored server-side only
- Real authentication with backend validation
- Session tokens for secure access
- Environment variables for configuration

## Production Deployment

1. Set environment variables on your hosting platform
2. Never commit the `.env` file
3. Use strong passwords
4. Consider adding HTTPS
5. Add rate limiting for production use