# Member Subscription Expiration Notification System - Implementation Guide

## Overview
This document outlines the implementation of a daily automated system that checks member subscription expiration dates and sends notifications to the admin panel (bell icon) and mobile devices (push notifications).

## Architecture

### Components
1. **Backend Scheduler**: Daily task that checks member expiration dates
2. **Notification Model**: Database model to store notifications
3. **Notification API**: REST endpoints for fetching and managing notifications
4. **Frontend Notification UI**: Bell icon with notification dropdown
5. **Push Notification Service**: Web Push API integration for mobile devices

## Implementation Details

### 1. Database Schema

#### Notification Model
```python
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gym_id = db.Column(db.Integer, db.ForeignKey("gym.gym_id"), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # 'subscription_expired', 'subscription_expiring_soon'
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    gym = db.relationship("Gym", backref="notifications")
    member = db.relationship("Member", backref="notifications")
```

### 2. Backend Implementation

#### Daily Scheduler Task
- **Library**: APScheduler (Advanced Python Scheduler)
- **Schedule**: Runs daily at 12:00 AM (configurable)
- **Function**: 
  - Queries all members with `expiration_date` not null
  - Checks if `expiration_date < current_date` (expired)
  - Creates notification for each expired member
  - Sends push notifications if user has subscribed

#### Notification Service
- **Location**: `backend/services/notification_service.py`
- **Functions**:
  - `check_expired_memberships()`: Main function to check and create notifications
  - `create_notification()`: Helper to create notification records
  - `send_push_notification()`: Send push notification to subscribed devices

#### API Endpoints
- `GET /api/notifications` - Get all notifications for current gym (admin only)
- `GET /api/notifications/unread` - Get unread notification count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read
- `POST /api/notifications/subscribe` - Subscribe to push notifications

### 3. Frontend Implementation

#### Notification Component
- **Location**: `frontend/src/app/components/Topbar.tsx`
- **Features**:
  - Bell icon with unread count badge
  - Dropdown showing recent notifications
  - Mark as read functionality
  - Real-time updates (polling every 30 seconds)
  - Click to view full notification details

#### Push Notification Setup
- **Service Worker**: `frontend/public/sw.js`
- **Manifest**: `frontend/public/manifest.json`
- **Registration**: Register service worker on admin login
- **Subscription**: Store subscription in backend

### 4. Push Notification Flow

1. **User grants permission** → Service worker registered
2. **Subscription created** → Stored in backend (PushSubscription model)
3. **Daily check runs** → Finds expired memberships
4. **Notification created** → Saved to database
5. **Push notification sent** → To all subscribed admin devices
6. **Frontend updates** → Bell icon shows new notification

## File Structure

```
backend/
├── models/
│   ├── notification.py          # Notification model
│   └── push_subscription.py     # Push subscription model
├── services/
│   ├── notification_service.py # Notification business logic
│   └── scheduler_service.py     # Scheduler setup
├── routes/
│   └── notification_route.py     # Notification API endpoints
└── app.py                        # Initialize scheduler

frontend/
├── src/
│   ├── app/
│   │   └── components/
│   │       └── Topbar.tsx       # Updated with notification UI
│   ├── lib/
│   │   └── notificationApi.ts   # API functions for notifications
│   └── hooks/
│       └── useNotifications.ts   # React hook for notifications
└── public/
    ├── sw.js                     # Service worker
    └── manifest.json            # PWA manifest
```

## Configuration

### Environment Variables

#### Backend
```env
# Scheduler Configuration
SCHEDULER_TIMEZONE=UTC
DAILY_CHECK_TIME=00:00  # HH:MM format

# Push Notification (VAPID keys - generate using web-push library)
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:admin@gymsetu.com
```

#### Frontend
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
```

## Installation Steps

### Backend
1. Install dependencies:
   ```bash
   pip install APScheduler pywebpush
   ```

2. Generate VAPID keys:
   ```python
   from pywebpush import webpush, WebPushException
   from py_vapid import Vapid01
   
   vapid = Vapid01()
   vapid.generate_keys()
   print(f"Public Key: {vapid.public_key}")
   print(f"Private Key: {vapid.private_key.hex()}")
   ```

3. Add models to `app.py` imports
4. Register notification routes
5. Initialize scheduler in `app.py`

### Frontend
1. Install dependencies:
   ```bash
   npm install web-push
   ```

2. Create service worker file
3. Update Topbar component
4. Add notification API functions

## Testing

### Manual Testing
1. Create a member with expiration_date in the past
2. Manually trigger the scheduler task
3. Verify notification appears in database
4. Check frontend bell icon shows notification
5. Test push notification on mobile device

### Automated Testing
- Unit tests for notification service
- Integration tests for API endpoints
- E2E tests for notification UI

## Deployment Considerations

### Production Setup
1. **Scheduler**: Ensure scheduler runs in a single instance (use database locks)
2. **Push Notifications**: Configure VAPID keys in production environment
3. **Service Worker**: Ensure HTTPS for push notifications (required by browsers)
4. **Database**: Add indexes on `notification.gym_id` and `notification.is_read`

### Monitoring
- Log scheduler execution
- Track notification creation rate
- Monitor push notification delivery failures
- Alert on scheduler failures

## Future Enhancements
1. Email notifications for expired memberships
2. SMS notifications (Twilio integration)
3. Notification preferences (admin can configure)
4. Notification history and filtering
5. Batch notification processing for large gyms
6. Notification templates for customization

## Troubleshooting

### Scheduler Not Running
- Check if scheduler is initialized in app.py
- Verify timezone configuration
- Check application logs for errors

### Push Notifications Not Working
- Verify service worker is registered
- Check browser console for errors
- Ensure HTTPS is enabled (required for push)
- Verify VAPID keys are correct

### Notifications Not Appearing
- Check database for notification records
- Verify API endpoints are accessible
- Check frontend polling is working
- Verify authentication tokens are valid

