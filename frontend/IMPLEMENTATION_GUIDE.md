# Complete Implementation Guide: Member/Trainer Login & Notifications

## Step-by-Step Implementation

### **Phase 1: Database Models (Backend)**

#### 1.1 Update Member Model
Add password field and authentication methods (similar to Gym model)

#### 1.2 Update Trainer Model  
Add password field and authentication methods

#### 1.3 Create Notification Model
```python
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)  # member_id, trainer_id, or gym_id
    user_type = db.Column(db.String(20), nullable=False)  # 'member', 'trainer', 'gym'
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # 'subscription_expired', etc.
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

#### 1.4 Create PushSubscription Model (for PWA)
```python
class PushSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    user_type = db.Column(db.String(20), nullable=False)
    endpoint = db.Column(db.Text, nullable=False)  # Web Push endpoint
    keys = db.Column(db.Text, nullable=False)  # JSON: auth, p256dh
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

---

### **Phase 2: Authentication System (Backend)**

#### 2.1 Update Login Endpoint
Modify `/api/auth/login` to:
- Try Gym first (existing)
- Then try Member
- Then try Trainer
- Return user type and role in response

#### 2.2 Add Password to Member/Trainer Creation
When gym owner adds member/trainer:
- Generate random password OR
- Send password via email/SMS
- Hash and store password

---

### **Phase 3: Background Job System (Backend)**

#### 3.1 Install Dependencies
```bash
pip install APScheduler  # For background jobs
pip install pywebpush   # For push notifications
```

#### 3.2 Create Subscription Checker
Daily/hourly job that:
- Checks all active subscriptions
- Finds expiring subscriptions (7 days, 3 days, 1 day, expired)
- Creates notifications in database
- Sends push notifications

#### 3.3 Notification Service
Service to:
- Create notifications
- Send push notifications
- Mark as read

---

### **Phase 4: Notification Endpoints (Backend)**

Create routes:
- `GET /api/notifications/get_notifications` - Get user's notifications
- `POST /api/notifications/mark_as_read` - Mark notification as read
- `POST /api/notifications/register_push` - Register PWA push subscription
- `DELETE /api/notifications/unregister_push` - Unregister push

---

### **Phase 5: Frontend - Member/Trainer Dashboards**

#### 5.1 Create Login Pages
- `/login` - Unified (or separate `/member/login`, `/trainer/login`)
- Role selector if unified

#### 5.2 Create Dashboards
- `/member/dashboard` - Member view (subscriptions, profile)
- `/trainer/dashboard` - Trainer view (schedule, members)

#### 5.3 Notification Component
- Badge with count
- Dropdown/list of notifications
- Mark as read
- Real-time updates

---

### **Phase 6: PWA Setup**

#### 6.1 Install PWA Package
```bash
npm install next-pwa
```

#### 6.2 Configure Service Worker
- Handle push notifications
- Background sync
- Offline support

#### 6.3 Push Notification Registration
- Request permission
- Subscribe to push service
- Send subscription to backend
- Handle incoming notifications

#### 6.4 PWA Manifest
Make app installable

---

## Quick Start: What to Build First

### **Priority 1: Core Functionality**
1. Add passwords to Member/Trainer
2. Update login to support all user types
3. Create notification model and endpoints

### **Priority 2: Notifications**
1. Background job for subscription checking
2. Admin notification panel
3. Member notification display

### **Priority 3: PWA Push**
1. Service worker setup
2. Push subscription registration
3. Push notification sending

---

## Example Code Structure

```
backend/
  models/
    notification.py          # NEW
    push_subscription.py     # NEW
    members.py              # UPDATE (add password)
    trainers.py             # UPDATE (add password)
  routes/
    auth_route.py           # UPDATE (unified login)
    notification_route.py   # NEW
  services/
    notification_service.py # NEW
    subscription_checker.py # NEW
  scheduler/
    background_jobs.py      # NEW

frontend/
  src/app/
    member/
      dashboard/            # NEW
      login/                # NEW (or update existing)
    trainer/
      dashboard/            # NEW
      login/                # NEW
    components/
      NotificationBell.tsx  # NEW
      NotificationList.tsx # NEW
  public/
    sw.js                   # NEW (Service Worker)
    manifest.json           # NEW (PWA manifest)
```

---

## Key Decisions Needed

1. **Password Management**:
   - Option A: Generate random password on member/trainer creation, email it
   - Option B: Let owner set password when adding
   - Option C: Allow member/trainer to set password on first login (via link)

2. **Notification Timing**:
   - How many days before expiration to notify? (7 days, 3 days, 1 day, expired?)
   - Daily check or hourly check?

3. **PWA Push Service**:
   - Self-hosted (requires HTTPS + VAPID keys)
   - Third-party service (OneSignal, Firebase Cloud Messaging)

4. **Member/Trainer Dashboard Scope**:
   - What features should members see?
   - What features should trainers see?

---

## Next Steps

Would you like me to:
1. **Start implementing** - I can begin with Phase 1 (database models)
2. **Provide code snippets** - Show example implementations
3. **Focus on specific part** - Which component is highest priority?

Let me know and I'll start building! 🚀

