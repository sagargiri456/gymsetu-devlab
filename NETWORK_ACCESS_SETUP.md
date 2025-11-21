# Network Access Setup Guide

## Problem
When accessing the application via IP address (e.g., `http://10.242.121.46:3000`), you get connection errors because:
1. The frontend tries to connect to `http://127.0.0.1:5000` (localhost)
2. The backend CORS doesn't allow requests from the IP address

## Solution

### Option 1: Quick Fix (Recommended)

#### Step 1: Update Backend Environment Variable
Add your IP address to the backend's `ALLOWED_ORIGINS` environment variable:

**Backend `.env` file:**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://10.242.121.46:3000
```

Replace `10.242.121.46` with your actual IP address.

#### Step 2: Restart Backend Server
After updating the environment variable, restart your backend server.

#### Step 3: Frontend Auto-Detection
The frontend has been updated to automatically detect the current hostname and use it for the backend API. So if you access:
- `http://10.242.121.46:3000` → Frontend will use `http://10.242.121.46:5000` for API calls

**No frontend changes needed!** The frontend will automatically adapt.

### Option 2: Manual Frontend Configuration

If you want to explicitly set the backend URL, add to **Frontend `.env.local` file:**
```env
NEXT_PUBLIC_API_URL=http://10.242.121.46:5000
```

Replace `10.242.121.46` with your actual IP address.

## Testing

1. **Start Backend:**
   ```bash
   cd backend
   python app.py
   # Or: gunicorn app:app
   ```
   Make sure it's accessible at `http://10.242.121.46:5000` (or your IP)

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application:**
   - Open browser and go to: `http://10.242.121.46:3000`
   - The frontend should automatically connect to `http://10.242.121.46:5000`

4. **Verify:**
   - Check browser console for any CORS errors
   - Check backend logs for: `CORS allowed origins: [...]`
   - Try logging in - it should work now!

## Troubleshooting

### Still Getting CORS Errors?

1. **Check Backend Logs:**
   Look for: `CORS allowed origins: [...]`
   Make sure your IP address is in the list

2. **Verify Backend is Accessible:**
   ```bash
   curl http://10.242.121.46:5000/health
   ```
   Should return: `{"status": "ok", "message": "Server is running"}`

3. **Check Firewall:**
   Make sure ports 3000 (frontend) and 5000 (backend) are open in your firewall

4. **Verify IP Address:**
   Make sure you're using the correct IP address. You can find it with:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   # or
   ip addr
   ```

### Multiple Devices on Network?

If you want to allow access from multiple IP addresses, add them all to `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://10.242.121.46:3000,http://192.168.1.100:3000
```

### Production Deployment

For production (Render/Vercel), you should:
1. Set specific allowed origins (not wildcards)
2. Use HTTPS URLs only
3. Set `FLASK_ENV=production` or `ENVIRONMENT=production` to enable strict CORS

## Summary

**What Changed:**
- ✅ Frontend now auto-detects hostname and uses it for backend API
- ✅ Backend CORS configuration supports IP addresses via `ALLOWED_ORIGINS`

**What You Need to Do:**
1. Add your IP to backend `ALLOWED_ORIGINS` environment variable
2. Restart backend server
3. Access via IP address - it should work!

