# Testing Checklist for Notification Features

## ✅ Pre-Testing Setup Checklist

### Backend Setup

- [x] **Dependencies Installed**
  - [x] APScheduler (for scheduled tasks)
  - [x] pywebpush (for push notifications)
  - [x] requests (for keep-alive pings)
  - [x] cryptography (for VAPID key generation)

- [x] **VAPID Keys Generated**
  - [x] Keys generated using `backend/generate_vapid_keys.py`
  - [ ] **TODO: Add VAPID keys to environment variables** (see below)

- [x] **Code Features Implemented**
  - [x] Health check endpoint (`/health`)
  - [x] Keep-alive scheduler (runs every 14 minutes)
  - [x] Expired membership checker
  - [x] Notification service
  - [x] Notification routes registered
  - [x] Database models (Notification, PushSubscription)

### Environment Variables Required

#### Backend (.env file or Render environment variables):
```env
# VAPID Keys (REQUIRED for push notifications)
VAPID_PUBLIC_KEY=BPPD4ah5bJn9BuJvFkHqjca2E1rPRD3pRV-vrwzosaHamZVwDgmdac6uqNPC3eSl_kzuNGdTRmcuTJyq9snFkt4
VAPID_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZ2lRVnZiaGlHbEtpTllFeFQKOGV1UTBRUkNYckVJbWFPc04xMWVycVRaOVZhaFJBTkNBQVR6dytHb2VXeVovUWJpYnhaQjZvM0d0aE5hejBROQo2VVZmcjY4TTZMR2gycG1WY0E0Sm5Xbk9ycWpUd3Qza3BmNU03alJuVTBabkxreWNxdmJKeFpMZQotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg
VAPID_SUBJECT=mailto:admin@gymsetu.com

# Scheduler Configuration (optional, defaults to 00:00 UTC)
DAILY_CHECK_TIME=00:00

# Server URL for keep-alive (optional, Render auto-sets RENDER_EXTERNAL_URL)
# SERVER_URL=https://your-app.onrender.com
```

#### Frontend (.env.local file):
```env
# VAPID Public Key (REQUIRED for push notifications)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BPPD4ah5bJn9BuJvFkHqjca2E1rPRD3pRV-vrwzosaHamZVwDgmdac6uqNPC3eSl_kzuNGdTRmcuTJyq9snFkt4
```

### Frontend Setup

- [x] **Service Worker**
  - [x] Service worker file exists at `frontend/public/sw.js`
  - [x] Service worker handles push events
  - [x] Service worker handles notification clicks

- [x] **Notification UI**
  - [x] Topbar component with notification bell icon
  - [x] Notification dropdown
  - [x] Push notification registration

- [x] **API Integration**
  - [x] Notification API functions
  - [x] Push notification subscription API

## 🧪 Testing Steps

### 1. Backend Testing

#### Test Health Check Endpoint
```bash
# Start your backend server, then:
curl http://localhost:5000/health
# Should return: {"status": "ok", "message": "Server is running"}
```

#### Test Keep-Alive Scheduler
1. Start the backend server
2. Check logs for: "Keep-alive job scheduled to run every 14 minutes"
3. Wait 14 minutes and check logs for: "Server health check successful - server kept alive"

#### Test Expired Membership Check (Manual)
```python
# In Python shell or script:
from app import app
from services.notification_service import check_expired_memberships

with app.app_context():
    result = check_expired_memberships()
    print(result)
```

#### Test Notification API Endpoints
```bash
# Get notifications (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/notifications

# Get unread count
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/notifications/unread-count
```

### 2. Frontend Testing

#### Test Notification UI
1. Log in as admin/gym owner
2. Check if notification bell icon appears in topbar
3. Click bell icon - should show notification dropdown
4. Verify notifications load (if any exist)

#### Test Push Notifications
1. Open admin dashboard in browser
2. Grant notification permission when prompted
3. Check browser console for:
   - "Service Worker registered"
   - "Push subscription created"
4. Verify service worker is registered (check DevTools > Application > Service Workers)

#### Test End-to-End Flow
1. Create a test member with `expiration_date` in the past
2. Manually trigger expired membership check (see above)
3. Verify:
   - Notification appears in database
   - Notification appears in UI (bell icon)
   - Push notification is received (if permission granted)

### 3. Production Testing (Render)

#### Before Deploying
- [ ] Add all environment variables to Render dashboard
- [ ] Verify `RENDER_EXTERNAL_URL` is automatically set by Render
- [ ] Test that keep-alive works (check logs after 14 minutes)

#### After Deploying
1. Test health endpoint: `https://your-app.onrender.com/health`
2. Verify scheduler starts (check logs)
3. Test notification flow with real data

## 🐛 Troubleshooting

### Notifications Not Appearing
- Check database: `SELECT * FROM notification;`
- Verify API endpoints return data
- Check browser console for errors
- Verify authentication token is valid

### Push Notifications Not Working
- Verify VAPID keys are set correctly
- Check browser console for service worker errors
- Ensure HTTPS is enabled (required for push notifications)
- Check browser notification permissions
- Verify service worker file is accessible at `/sw.js`

### Scheduler Not Running
- Check logs for "Scheduler initialized successfully"
- Verify APScheduler is installed
- Check for errors in scheduler initialization

### Keep-Alive Not Working
- Verify `RENDER_EXTERNAL_URL` or `SERVER_URL` is set
- Check logs for keep-alive ping attempts
- Verify `/health` endpoint is accessible

## 📝 Next Steps

1. **Add Environment Variables**: Copy the VAPID keys to your `.env` files
2. **Test Locally**: Run through the testing steps above
3. **Deploy to Production**: Add environment variables to Render/Vercel
4. **Monitor**: Check logs regularly to ensure everything is working

## ✅ Ready to Test?

Once you've:
- [ ] Added VAPID keys to backend `.env` file
- [ ] Added VAPID public key to frontend `.env.local` file
- [ ] Started both backend and frontend servers
- [ ] Verified database models are created

You're ready to test! Start with the manual membership expiration check to verify the notification system works end-to-end.

