# Domain Setup Guide for gymsetu.space

## Problem
When accessing the application from `gymsetu.space`, you get connection errors because:
1. The frontend doesn't know where the backend API is located
2. The backend CORS doesn't allow requests from `gymsetu.space`

## Solution

### Step 1: Set Frontend Environment Variable

The frontend needs to know where your backend API is hosted. If your backend is on Render, you need to set the `NEXT_PUBLIC_API_URL` environment variable.

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-backend-app.onrender.com` (replace with your actual Render backend URL)
   - **Environment:** Production, Preview, Development (select all)
4. **Redeploy** your application after adding the variable

#### For Local Development with Domain:
If you're testing locally with a domain name (via hosts file or local DNS):
1. Create or edit `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
   ```
2. Restart your Next.js dev server

### Step 2: Configure Backend CORS

The backend needs to allow requests from `gymsetu.space`.

#### For Render Backend:
1. Go to your Render service dashboard
2. Navigate to **Environment** tab
3. Add or update the `ALLOWED_ORIGINS` environment variable:
   ```env
   ALLOWED_ORIGINS=https://gymsetu.space,https://www.gymsetu.space,http://localhost:3000
   ```
   **Note:** Include both `https://gymsetu.space` and `https://www.gymsetu.space` if you use both

4. Also set `FRONTEND_URL`:
   ```env
   FRONTEND_URL=https://gymsetu.space
   ```

5. **Redeploy** your backend service after updating environment variables

#### For Local Backend:
If running backend locally, update `backend/.env`:
```env
ALLOWED_ORIGINS=https://gymsetu.space,https://www.gymsetu.space,http://localhost:3000,http://127.0.0.1:3000
FRONTEND_URL=https://gymsetu.space
```

### Step 3: Verify Configuration

1. **Check Frontend:**
   - Open browser console on `gymsetu.space`
   - Check the Network tab - API calls should go to your Render backend URL
   - Look for any CORS errors

2. **Check Backend Logs:**
   - In Render dashboard, check logs
   - Look for: `CORS allowed origins: [...]`
   - Verify `https://gymsetu.space` is in the list

3. **Test API Connection:**
   ```bash
   curl https://your-backend-app.onrender.com/health
   ```
   Should return: `{"status": "ok", "message": "Server is running"}`

## Complete Environment Variables Checklist

### Frontend (Vercel or `.env.local`):
```env
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key_here
```

### Backend (Render or `.env`):
```env
ALLOWED_ORIGINS=https://gymsetu.space,https://www.gymsetu.space,http://localhost:3000
FRONTEND_URL=https://gymsetu.space
JWT_SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:admin@gymsetu.com
```

## Common Issues

### Issue: "Connection refused" or "Network error"
**Cause:** Frontend doesn't know where backend is  
**Solution:** Set `NEXT_PUBLIC_API_URL` in frontend environment variables

### Issue: CORS error in browser console
**Cause:** Backend doesn't allow requests from your domain  
**Solution:** Add `https://gymsetu.space` to backend `ALLOWED_ORIGINS`

### Issue: Works on localhost but not on domain
**Cause:** Environment variables not set for production  
**Solution:** Make sure environment variables are set in Vercel/Render, not just locally

### Issue: Mixed content error (HTTP/HTTPS)
**Cause:** Frontend is HTTPS but trying to connect to HTTP backend  
**Solution:** 
- Use HTTPS for backend (Render provides this)
- Make sure `NEXT_PUBLIC_API_URL` uses `https://`

## Testing Checklist

- [ ] `NEXT_PUBLIC_API_URL` is set in Vercel/frontend environment
- [ ] `ALLOWED_ORIGINS` includes `https://gymsetu.space` in backend
- [ ] `FRONTEND_URL` is set to `https://gymsetu.space` in backend
- [ ] Both frontend and backend are redeployed after changes
- [ ] Backend health endpoint is accessible: `https://your-backend.onrender.com/health`
- [ ] No CORS errors in browser console
- [ ] Login works from `gymsetu.space`

## Quick Fix Summary

**For gymsetu.space to work, you need:**

1. **Frontend:** Set `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com` in Vercel
2. **Backend:** Set `ALLOWED_ORIGINS=...,https://gymsetu.space` in Render
3. **Backend:** Set `FRONTEND_URL=https://gymsetu.space` in Render
4. **Redeploy both** after making changes

That's it! After these changes, `gymsetu.space` should work correctly.

