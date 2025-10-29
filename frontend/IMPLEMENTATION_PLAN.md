# Member/Trainer Login & Notification System Implementation Plan

## Overview
Implement member/trainer authentication and subscription expiration notifications (PWA push + admin panel).

## Architecture Components

### 1. **Backend Authentication System**
- Add password fields to `Member` and `Trainer` models
- Create unified login endpoint that handles Gym/Member/Trainer
- Store user role in JWT token
- Role-based access control

### 2. **Notification System**
- Database table for notifications
- Background scheduler to check subscription expiration
- Push notification service (for PWA)
- In-app notification display

### 3. **PWA Setup**
- Service worker for push notifications
- Web Push API integration
- Manifest file for installable PWA

### 4. **Frontend Updates**
- Separate member/trainer dashboard
- Notification display component
- Push notification registration

## Implementation Steps

### Phase 1: Database Changes
1. Add `password_hash` to Member model
2. Add `password_hash` to Trainer model
3. Create `Notification` model
4. Create `PushSubscription` model (for storing PWA subscriptions)

### Phase 2: Backend Authentication
1. Update Member/Trainer models with password hashing
2. Create unified login endpoint (`/api/auth/login` - detects user type)
3. Create member/trainer-specific endpoints
4. Role-based middleware

### Phase 3: Notification Backend
1. Create Notification model
2. Background scheduler (APScheduler or Celery)
3. Subscription expiration checker
4. Notification creation logic
5. Push notification service

### Phase 4: Frontend Authentication
1. Member login page
2. Trainer login page (or unified with role selector)
3. Member dashboard
4. Trainer dashboard

### Phase 5: PWA Setup
1. Service worker setup
2. Web Push subscription
3. Push notification handler
4. PWA manifest

### Phase 6: Admin Notifications
1. Notification component in admin dashboard
2. Real-time updates (WebSocket or polling)
3. Mark as read functionality

## Technology Stack Recommendations

### Backend:
- **Background Jobs**: APScheduler (simple) or Celery (complex, distributed)
- **Push Notifications**: `pywebpush` (Web Push Protocol)
- **Task Queue**: Redis (optional, for Celery)

### Frontend:
- **PWA**: Next.js PWA plugin (`next-pwa`)
- **Push Notifications**: Service Worker API
- **Real-time**: WebSocket or Server-Sent Events (SSE)

## Database Schema Additions

```python
# Notification Model
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)  # member_id or gym_id
    user_type = db.Column(db.String(20), nullable=False)  # 'member', 'trainer', 'gym'
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # 'subscription_expired', etc.
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# PushSubscription Model (for PWA)
class PushSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    user_type = db.Column(db.String(20), nullable=False)
    endpoint = db.Column(db.Text, nullable=False)
    keys = db.Column(db.Text, nullable=False)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

## Notification Flow

1. **Background Job** (runs daily/hourly):
   - Check all active subscriptions
   - Find subscriptions expiring in next 7 days
   - Find expired subscriptions
   - Create notifications

2. **For Each Notification**:
   - Save to database
   - Send push notification (if user has PWA subscription)
   - Real-time update to admin panel (if owner)

3. **User Receives**:
   - Push notification on phone (if PWA installed)
   - In-app notification (dashboard)
   - Admin sees in notification panel

## Security Considerations

1. **Password Storage**: Use bcrypt (already in use for Gym)
2. **JWT Tokens**: Include role in token for authorization
3. **Push Notifications**: Encrypt with VAPID keys
4. **Rate Limiting**: Prevent login abuse

## Deployment Considerations

1. **Background Jobs**: 
   - Render: Use APScheduler (runs in same process)
   - Or: Separate worker process with Celery

2. **Push Notifications**:
   - Generate VAPID keys for your domain
   - Store keys in environment variables

3. **Database**:
   - Migration script for new columns/tables

