# Deployment Guide for GymSetu

This guide covers deploying the frontend to Vercel and backend to Render with proper CORS configuration.

## Frontend (Vercel) Setup

### 1. Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com
```

Replace `your-app-name.onrender.com` with your actual Render backend URL.

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js
4. Add the `NEXT_PUBLIC_API_URL` environment variable
5. Deploy

**Note:** After deployment, you'll get a Vercel URL like `https://your-app.vercel.app`. You'll need this for the backend CORS configuration.

## Backend (Render) Setup

### 1. Environment Variables in Render

Go to your Render service → Environment and add:

```
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET_KEY=your-secret-key-change-this
DATABASE_URL=your-database-url-here
```

**Important:**
- Replace `https://your-app.vercel.app` with your actual Vercel deployment URL
- Add all Vercel preview URLs if you want preview deployments to work
- Set a strong `JWT_SECRET_KEY` for production
- Configure your database connection string

### 2. Deploy to Render

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Build Command: `pip install -r requirements.txt` (or your setup command)
4. Start Command: `gunicorn app:app` or `python app.py` (adjust based on your entry point)
5. Add all environment variables listed above
6. Deploy

### 3. CORS Configuration

The backend is already configured to:
- Read allowed origins from `ALLOWED_ORIGINS` environment variable
- Add Vercel URLs automatically if `FRONTEND_URL` contains "vercel.app"
- Support credentials for authenticated requests

## Testing After Deployment

1. **Test Frontend:** Visit your Vercel URL
2. **Test Login:** Try logging in - it should connect to your Render backend
3. **Check CORS:** Open browser DevTools → Network tab and verify:
   - API requests go to your Render backend URL
   - CORS headers are present in responses
   - No CORS errors in console

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check that `NEXT_PUBLIC_API_URL` in Vercel points to your Render URL
2. Check that `ALLOWED_ORIGINS` in Render includes your Vercel URL
3. Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
4. Restart both services after changing environment variables

### API Connection Errors

If API calls fail:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Check that your Render service is running and accessible
3. Verify the backend logs in Render for errors
4. Test the API directly with a tool like Postman or curl

### Environment Variables Not Working

- Vercel: Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Render: Restart the service after adding environment variables
- Both: Changes to environment variables require a redeploy

## Production Checklist

- [ ] Set strong `JWT_SECRET_KEY` in Render
- [ ] Configure production database in Render
- [ ] Add Vercel production URL to `ALLOWED_ORIGINS`
- [ ] Add `NEXT_PUBLIC_API_URL` to Vercel
- [ ] Test login flow end-to-end
- [ ] Test API calls from frontend
- [ ] Verify CORS headers in production
- [ ] Set up error monitoring (optional but recommended)

## Support for Preview Deployments

If you want to support Vercel preview deployments, add this to Render's `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app,https://*.vercel.app
```

Note: Wildcard patterns in CORS need to be handled carefully. The current implementation adds wildcard patterns when a Vercel URL is detected.

