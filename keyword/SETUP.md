# SEO Tools Setup Guide

## 🚀 Running the Application

The application now uses a **Node.js backend server** for reliable website fetching with proper headers and cookie handling.

### Starting Both Frontend and Backend:

**Option 1: Run both simultaneously (requires concurrently)**
```bash
npm run dev:all
```

**Option 2: Run separately (recommended for debugging)**

Terminal 1 - Start the Vite dev server:
```bash
npm run dev
```

Terminal 2 - Start the backend server:
```bash
npm run dev:backend
```
or
```bash
node server.js
```

### ✅ Verify Everything is Running:

- **Frontend**: http://localhost:5175
- **Backend**: http://localhost:3001/api/health

### 🎯 Features:

1. **SEO Checker**:
   - Analyzes 12 SEO factors
   - Calculates SEO score (0-100)
   - Shows Domain Authority (DA)
   - Shows Page Authority (PA)
   - Displays backlink count

2. **Schema Generator**:
   - 11 schema categories
   - 30+ schema types
   - Date/time pickers for all date fields
   - Live JSON preview

### 🔧 Backend Server Details:

- **Port**: 3001
- **Endpoints**:
  - `POST /api/fetch-website` - Fetch and parse website content
  - `GET /api/health` - Server health check

The backend server handles:
- CORS issues automatically
- Proper HTTP headers and User-Agent
- Request timeouts (15 seconds)
- SSL/TLS certificate errors
- HTTP redirects

### ⚠️ Troubleshooting:

**"Unable to fetch website content" error**:
1. Ensure backend server is running: `npm run dev:backend`
2. Check URL is correct (should include http:// or https://)
3. Verify website is accessible (try in browser first)
4. Check console (F12) for detailed error messages

**Backend won't start**:
- Ensure port 3001 is not in use
- Run: `netstat -ano | findstr 3001` to check
- Try killing the process using that port

**Frontend not updating**:
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check Vite dev server is running on 5175

### 📦 Dependencies:

- React 19.2.0
- Express 4.18.2
- Node-fetch 3.3.2
- CORS 2.8.5
- Vite (Rolldown)

Enjoy using the SEO Tools! 🎉
