# Local Development Setup

## Quick Fix for CORS Errors

If you're seeing CORS errors in local development:

### For Local Development:

1. **Check your `.env.local` file** (in the `frontend` directory)
   
   Either:
   - **Remove** `NEXT_PUBLIC_API_URL` entirely, OR
   - Set it to: `NEXT_PUBLIC_API_URL=http://127.0.0.1:5000`

2. **Restart your Next.js dev server** after changing the environment variable

### Verify Your Setup:

1. **Frontend** should be running on `http://localhost:3000`
2. **Backend** should be running on `http://127.0.0.1:5000` or `http://localhost:5000`
3. **No environment variable** set for `NEXT_PUBLIC_API_URL`, OR it points to `http://127.0.0.1:5000`

### Common Issues:

**Issue:** Frontend tries to connect to `https://your-app-name.onrender.com`
- **Solution:** Remove `NEXT_PUBLIC_API_URL` from your environment variables or set it to `http://127.0.0.1:5000`

**Issue:** CORS error even with correct URL
- **Solution:** 
  1. Make sure backend is running
  2. Check backend logs - you should see: `CORS allowed origins: ['http://localhost:3000', ...]`
  3. Restart backend after any changes

### Environment Variables:

**For Local Development** (`.env.local` in frontend):
```env
# Either leave this unset (uses default http://127.0.0.1:5000)
# OR set it explicitly:
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

**For Backend** (`.env` in backend):
```env
# Optional - defaults to http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

