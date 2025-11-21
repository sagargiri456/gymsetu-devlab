# Setup Guide for Member Expiration Notification System

## Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Generate VAPID Keys for Push Notifications

You need to generate VAPID (Voluntary Application Server Identification) keys for push notifications. You can do this using Python:

```python
from py_vapid import Vapid01

vapid = Vapid01()
vapid.generate_keys()
print(f"Public Key: {vapid.public_key.hex()}")
print(f"Private Key: {vapid.private_key.hex()}")
```

Or use an online tool like: https://web-push-codelab.glitch.me/

#### Environment Variables

Add these to your `.env` file or environment:

```env
# Scheduler Configuration
DAILY_CHECK_TIME=00:00  # Format: HH:MM (24-hour format, UTC timezone)

# Push Notification VAPID Keys (from step above)
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=mailto:admin@gymsetu.com  # Your contact email
```

#### Database Migration

The new models (Notification and PushSubscription) will be automatically created when you start the server. If you need to manually create them:

```python
from app import app
from database import db
from models.notification import Notification
from models.push_subscription import PushSubscription

with app.app_context():
    db.create_all()
```

### 2. Frontend Setup

#### Environment Variables

Add to your `.env.local` or `.env` file:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here  # Same as backend VAPID_PUBLIC_KEY
```

#### Service Worker

The service worker (`public/sw.js`) is automatically registered when the admin logs in. Make sure your Next.js app serves static files from the `public` directory.

### 3. Testing

#### Test the Scheduler

To test the scheduler immediately (without waiting for the scheduled time), you can manually trigger it:

```python
from app import app
from services.notification_service import check_expired_memberships

with app.app_context():
    result = check_expired_memberships()
    print(result)
```

#### Test Notifications

1. Create a member with an `expiration_date` in the past
2. Manually trigger the scheduler (see above)
3. Check the admin dashboard - you should see a notification in the bell icon
4. If you've granted push notification permission, you should also receive a push notification

#### Test Push Notifications

1. Open the admin dashboard in a browser
2. Grant notification permission when prompted
3. The service worker will be registered automatically
4. When a member subscription expires, you'll receive a push notification

### 4. Production Deployment

#### Important Notes

1. **HTTPS Required**: Push notifications require HTTPS (except for localhost). Make sure your production site uses HTTPS.

2. **Scheduler in Production**: The scheduler runs in the same process as your Flask app. For production, consider:
   - Using a process manager (like systemd or supervisor) to ensure the scheduler runs
   - Or use a separate worker process for scheduled tasks
   - Or use a cloud scheduler (like AWS EventBridge, Google Cloud Scheduler) to trigger an endpoint

3. **Database Indexes**: For better performance, add indexes:
   ```sql
   CREATE INDEX idx_notification_gym_id ON notification(gym_id);
   CREATE INDEX idx_notification_is_read ON notification(is_read);
   CREATE INDEX idx_notification_created_at ON notification(created_at);
   CREATE INDEX idx_member_expiration_date ON member(expiration_date);
   ```

4. **VAPID Keys**: Keep your VAPID private key secure. Never commit it to version control.

### 5. Troubleshooting

#### Scheduler Not Running
- Check application logs for scheduler initialization messages
- Verify APScheduler is installed: `pip list | grep APScheduler`
- Check if the scheduler is running: Look for "Scheduler initialized" in logs

#### Push Notifications Not Working
- Verify VAPID keys are set correctly in environment variables
- Check browser console for service worker registration errors
- Ensure HTTPS is enabled (required for push notifications)
- Check browser notification permissions in settings
- Verify service worker file is accessible at `/sw.js`

#### Notifications Not Appearing
- Check database for notification records: `SELECT * FROM notification;`
- Verify API endpoints are accessible: `GET /api/notifications`
- Check browser console for API errors
- Verify authentication token is valid

### 6. API Endpoints

- `GET /api/notifications` - Get all notifications (admin only)
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `POST /api/notifications/subscribe` - Subscribe to push notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe from push notifications

### 7. Customization

#### Change Check Time
Set `DAILY_CHECK_TIME` environment variable (e.g., `DAILY_CHECK_TIME=09:00` for 9 AM)

#### Notification Message Format
Edit `backend/services/notification_service.py` in the `check_expired_memberships()` function to customize notification messages.

#### Frontend Polling Interval
Edit `frontend/src/app/components/Topbar.tsx` - change the interval in the `useEffect` hook (currently 30000ms = 30 seconds).

