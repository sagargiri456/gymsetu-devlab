# Member Dashboard Design Document

## Overview
This document outlines the complete design for the Member Dashboard, including all features, pages, and user experience considerations.

---

## 1. Member Dashboard Pages & Navigation

### Visible Pages for Members:
1. **Dashboard (Home)** - Overview and stats
2. **Workout Plan** - View assigned workout routines
3. **Diet Plan** - View assigned nutrition plans
4. **My Trainer** - View assigned trainer details and contact
5. **Contests** - View and participate in ongoing/upcoming contests
6. **My Progress** - Track fitness progress and metrics
7. **My Profile** - Edit personal information
8. **Settings** - Account settings

### Hidden Pages for Members:
- Members Management (owner only)
- Trainers Management (owner only)
- Owner Dashboard Stats (owner only)
- Subscription Plans Management (owner only)
- All Subscriptions View (owner only)

---

## 2. Member Dashboard Home Page (`/dashboard`)

### Layout Structure:
```
┌─────────────────────────────────────────────────────────┐
│  Welcome Header with Member Name                        │
├─────────────────────────────────────────────────────────┤
│  Quick Stats Cards (4 cards in a row)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Active   │ │ Days     │ │ Workouts │ │ Contests │  │
│  │ Days     │ │ Remaining│ │ This Week│ │ Joined   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  Today's Schedule (Left Column)                        │
│  ┌──────────────────────────────────────┐             │
│  │ • Workout: Chest & Triceps (9 AM)   │             │
│  │ • Trainer Session (2 PM)            │             │
│  │ • Diet: Meal Plan Follow-up         │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Recent Progress (Right Column)                        │
│  ┌──────────────────────────────────────┐             │
│  │ Weight Chart / Body Metrics          │             │
│  │ Workout Completion Graph             │             │
│  └──────────────────────────────────────┘             │
├─────────────────────────────────────────────────────────┤
│  Quick Actions                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ View     │ │ View     │ │ Contact  │              │
│  │ Workout  │ │ Diet     │ │ Trainer  │              │
│  └──────────┘ └──────────┘ └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

### Components:
1. **Welcome Section**
   - Member name with greeting
   - Subscription status badge (Active/Expired/Days Remaining)
   - Quick member stats (BMI, weight, height)

2. **Stats Cards (4 cards)**
   - **Active Days**: Days since joining
   - **Days Remaining**: Subscription expiry countdown
   - **Workouts This Week**: Completed/total workouts
   - **Contests Joined**: Number of active contests

3. **Today's Schedule**
   - Upcoming workout sessions
   - Trainer appointments
   - Diet check-ins
   - Contest deadlines

4. **Progress Charts**
   - Weight progress over time (line chart)
   - Workout completion rate (bar chart)
   - Body measurements (optional)

5. **Quick Actions**
   - View current workout plan
   - View diet plan
   - Contact trainer
   - View ongoing contests

---

## 3. Workout Plan Page (`/dashboard/workout-plan`)

### Features:
- **Current Workout Plan Display**
  - Plan name and description
  - Duration (e.g., "4 weeks", "12 weeks")
  - Start and end dates
  - Days per week

- **Weekly Schedule View**
  - Monday - Sunday calendar
  - Workout sessions for each day
  - Exercise details:
    - Exercise name
    - Sets × Reps
    - Weight/Resistance
    - Rest time
    - Notes/Tips

- **Exercise Details**
  - Exercise name
  - Target muscle groups
  - Instructions/description
  - Video/Demo link (if available)
  - Progress tracking:
    - Personal bests
    - Last performed weight/sets
    - Progress indicators

- **Workout History**
  - Completed workouts log
  - Date, duration, exercises completed
  - Performance trends

- **Actions**
  - Mark workout as completed
  - Log workout performance
  - View exercise library
  - Request workout modification (if needed)

### Layout:
```
┌─────────────────────────────────────────────────────────┐
│  Workout Plan Header                                     │
│  Plan Name | Duration | Progress                        │
├─────────────────────────────────────────────────────────┤
│  Weekly Schedule (Calendar View)                        │
│  Mon | Tue | Wed | Thu | Fri | Sat | Sun               │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │Day1│ │Day2│ │Day3│ │Day4│ │Day5│ │Rest│ │Rest│    │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘    │
├─────────────────────────────────────────────────────────┤
│  Selected Day Workout Details                           │
│  ┌──────────────────────────────────────────────┐      │
│  │ Exercise 1: Bench Press                      │      │
│  │   Sets: 4 × 8-10 reps                        │      │
│  │   Weight: 80kg (Personal Best: 85kg)        │      │
│  │   Rest: 90 seconds                           │      │
│  │   [Mark Complete] [Log Performance]          │      │
│  │                                               │      │
│  │ Exercise 2: Incline Dumbbell Press...        │      │
│  └──────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────┤
│  Workout History (Last 7 workouts)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Diet Plan Page (`/dashboard/diet-plan`)

### Features:
- **Current Diet Plan Display**
  - Plan name and goal (weight loss, muscle gain, maintenance)
  - Daily calorie target
  - Macronutrient breakdown (Protein, Carbs, Fats)
  - Duration and start date

- **Daily Meal Plan**
  - **Breakfast**
    - Meal name
    - Ingredients
    - Calories
    - Macros (P/C/F)
    - Preparation instructions
  
  - **Lunch**
    - Same details as breakfast
  
  - **Dinner**
    - Same details as breakfast
  
  - **Snacks**
    - Optional snacks with calories

- **Nutritional Summary**
  - Daily totals (calories, protein, carbs, fats)
  - Progress towards daily goals
  - Weekly nutrition trends

- **Meal Logging**
  - Log meals consumed
  - Track adherence to plan
  - Custom meal logging (if deviated from plan)

- **Actions**
  - Mark meal as consumed
  - View recipe details
  - Log custom meals
  - Request diet modification

### Layout:
```
┌─────────────────────────────────────────────────────────┐
│  Diet Plan Header                                        │
│  Plan Name | Goal | Daily Calories: 2000 kcal          │
├─────────────────────────────────────────────────────────┤
│  Daily Nutrition Goals                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Calories │ │ Protein  │ │ Carbs    │ │ Fats     │  │
│  │ 1500/2000│ │ 120/150g │ │ 150/200g │ │ 50/65g   │  │
│  │ ████░░░░ │ │ ████░░   │ │ ███░░░░░ │ │ ████░░░░ │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  Today's Meal Plan                                      │
│  ┌──────────────────────────────────────────────┐     │
│  │ Breakfast (8:00 AM)                          │     │
│  │ Oatmeal with Berries & Protein Shake         │     │
│  │ Calories: 450 | P: 30g | C: 60g | F: 10g    │     │
│  │ [Mark as Eaten] [View Recipe]                │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │ Lunch (1:00 PM)                               │     │
│  │ Grilled Chicken with Brown Rice & Vegetables│     │
│  │ Calories: 650 | P: 45g | C: 70g | F: 15g    │     │
│  │ [Mark as Eaten] [View Recipe]                │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │ Dinner (7:00 PM)                              │     │
│  │ Salmon with Sweet Potato & Broccoli          │     │
│  │ Calories: 600 | P: 40g | C: 50g | F: 20g    │     │
│  │ [Mark as Eaten] [View Recipe]                │     │
│  └──────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────┤
│  Weekly Nutrition Progress                             │
│  [Nutrition Chart]                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 5. My Trainer Page (`/dashboard/my-trainer`)

### Features:
- **Trainer Profile Card**
  - Trainer photo
  - Name
  - Specialization
  - Experience (years)
  - Certifications
  - Bio/Description

- **Contact Information**
  - Email
  - Phone
  - Availability hours
  - Preferred contact method

- **Trainer Stats**
  - Sessions completed together
  - Total hours trained
  - Upcoming sessions
  - Next appointment date/time

- **Recent Sessions**
  - Last 5 training sessions
  - Date, duration, focus areas
  - Notes from trainer (if available)

- **Communication**
  - Quick message button
  - Schedule session request
  - View trainer notes/feedback

- **Actions**
  - Send message
  - Request session
  - View trainer schedule (if available)
  - View session history

### Layout:
```
┌─────────────────────────────────────────────────────────┐
│  My Trainer                                              │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  Trainer Stats               │
│  │  [Trainer Photo]     │  ┌──────────────────────────┐ │
│  │                      │  │ Sessions: 12            │ │
│  │  John Doe            │  │ Hours: 24h              │ │
│  │  Strength Training  │  │ Next: Mon, Nov 11, 2 PM  │ │
│  │  5 years experience  │  └──────────────────────────┘ │
│  │                      │                              │
│  │  Certifications:     │  Contact Information        │
│  │  • NASM Certified    │  ┌──────────────────────────┐ │
│  │  • CPR Certified     │  │ Email: john@example.com  │ │
│  │                      │  │ Phone: +1 234-567-8900   │ │
│  │  Bio:               │  │ Available: Mon-Fri, 9-5  │ │
│  │  Expert in...        │  └──────────────────────────┘ │
│  └──────────────────────┘                              │
├─────────────────────────────────────────────────────────┤
│  Quick Actions                                           │
│  [Send Message] [Request Session] [View History]         │
├─────────────────────────────────────────────────────────┤
│  Recent Sessions                                         │
│  ┌──────────────────────────────────────────────┐     │
│  │ Nov 5, 2024 - Upper Body Focus (1.5 hours)  │     │
│  │ Nov 3, 2024 - Cardio & Conditioning (1 hour) │     │
│  └──────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Contests Page (`/dashboard/contest`)

### Features:
- **Ongoing Contests Tab**
  - Contest cards with:
    - Contest banner
    - Contest name
    - Description
    - Start/End dates
    - Participation status (Joined/Not Joined)
    - Current rank (if joined)
    - Leaderboard link (if joined)
    - Participate/View Leaderboard button

- **Upcoming Contests Tab**
  - Contest cards with:
    - Contest banner
    - Contest name
    - Description
    - Start date
    - Participate button
    - Contest preview

- **Contest Details Modal**
  - Full contest information
  - Prizes
  - Rules
  - Participation button
  - Leaderboard link (if joined)

- **My Contest Performance**
  - Contests joined
  - Current rankings
  - Progress towards goals
  - Achievements/badges

### Layout: (Already implemented, but enhanced for members)
- Same as current contest page
- "Participate" button for members
- "View Leaderboard" for joined contests
- Contest status indicators

---

## 7. My Progress Page (`/dashboard/progress`)

### Features:
- **Body Metrics Tracking**
  - Weight progression (line chart)
  - Body measurements (chest, waist, arms, etc.)
  - BMI calculation and trend
  - Body fat percentage (if tracked)
  - Progress photos (before/after)

- **Workout Statistics**
  - Workouts completed this month
  - Total workout hours
  - Consistency streak (days in a row)
  - Exercise PRs (Personal Records)
  - Most performed exercises

- **Nutrition Tracking**
  - Daily calorie intake trend
  - Macro adherence percentage
  - Meal plan compliance
  - Weekly nutrition summary

- **Achievements & Milestones**
  - Badges earned
  - Goals achieved
  - Milestones reached
  - Streaks maintained

- **Goal Setting**
  - Current goals (weight, strength, etc.)
  - Progress towards goals
  - Set new goals
  - Goal completion timeline

### Layout:
```
┌─────────────────────────────────────────────────────────┐
│  My Progress                                            │
├─────────────────────────────────────────────────────────┤
│  Body Metrics                                           │
│  ┌──────────────────────────────────────────────┐      │
│  │ Weight Progress Chart                        │      │
│  │ [Line Chart: Weight over time]               │      │
│  └──────────────────────────────────────────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ Current  │ │ Starting  │ │ Goal     │              │
│  │ 75 kg    │ │ 80 kg     │ │ 70 kg    │              │
│  └──────────┘ └──────────┘ └──────────┘              │
├─────────────────────────────────────────────────────────┤
│  Workout Statistics                                     │
│  ┌──────────────────────────────────────────────┐      │
│  │ This Month: 18 workouts | 24 hours           │      │
│  │ Current Streak: 5 days                        │      │
│  │ Personal Records:                            │      │
│  │ • Bench Press: 85kg                           │      │
│  │ • Squat: 120kg                                │      │
│  └──────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────┤
│  Achievements                                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                         │
│  │ 🏆 │ │ 🔥 │ │ 💪 │ │ ⭐ │                         │
│  │100  │ │ 30 │ │ 50 │ │ 10 │                         │
│  │Days │ │Day │ │Work│ │Goal│                         │
│  └────┘ └────┘ └────┘ └────┘                         │
└─────────────────────────────────────────────────────────┘
```

---

## 8. My Profile Page (`/dashboard/profile`)

### Features:
- **Personal Information**
  - Name, Email, Phone
  - Address
  - Date of Birth
  - Gender
  - Profile Photo

- **Physical Information**
  - Height
  - Weight (current)
  - Body measurements (optional)
  - Fitness goals

- **Subscription Information**
  - Current subscription plan
  - Start date
  - Expiry date
  - Days remaining
  - Renewal information

- **Account Settings**
  - Change password
  - Privacy settings
  - Notification preferences

- **Actions**
  - Edit profile
  - Update photo
  - Change password
  - View subscription details

---

## 9. Member Sidebar Navigation

### Navigation Items:
```
┌─────────────────────────┐
│  Dashboard (Home)        │
│  Workout Plan            │
│  Diet Plan               │
│  My Trainer              │
│  Contests                │
│  My Progress             │
│  My Profile              │
│  Settings                │
│  Help                    │
│  Logout                  │
└─────────────────────────┘
```

### Icons:
- Dashboard: `MdDashboard`
- Workout Plan: `MdFitnessCenter` or `MdDirectionsRun`
- Diet Plan: `MdRestaurant` or `MdLocalDining`
- My Trainer: `MdPerson` or `MdVerifiedUser`
- Contests: `MdEmojiEvents` or `MdSportsKabaddi`
- My Progress: `MdTrendingUp` or `MdBarChart`
- My Profile: `MdAccountCircle`
- Settings: `MdSettings`
- Help: `MdHelpOutline`

---

## 10. Additional Features & Recommendations

### A. Notifications System
- **Workout Reminders**: "Your workout is scheduled in 1 hour"
- **Diet Reminders**: "Time for your meal!"
- **Trainer Messages**: Notifications when trainer sends a message
- **Contest Updates**: "New contest started!" or "Contest ending soon"
- **Subscription Alerts**: "Your subscription expires in 7 days"
- **Achievements**: "Congratulations! You've completed 10 workouts!"

### B. Workout Logging
- **Quick Log**: Log completed exercises after workout
- **Performance Tracking**: Record sets, reps, weight used
- **Notes**: Add personal notes about the workout
- **Photos**: Upload workout photos (optional)

### C. Diet Logging
- **Meal Check-ins**: Mark meals as consumed
- **Custom Meals**: Log meals not in the plan
- **Water Intake**: Track daily water consumption
- **Recipe Library**: Save favorite recipes

### D. Trainer Communication
- **Messaging**: Direct messaging with trainer
- **Session Requests**: Request training sessions
- **Feedback**: Share feedback after sessions
- **Progress Updates**: Share progress with trainer

### E. Social Features (Optional)
- **Leaderboard**: See rankings in contests
- **Achievements**: Public badges and milestones
- **Progress Sharing**: Share achievements (optional)

### F. Reminders & Notifications
- **Workout Reminders**: Daily workout schedule reminders
- **Meal Reminders**: Meal time notifications
- **Trainer Sessions**: Appointment reminders
- **Contest Deadlines**: Contest participation reminders

---

## 11. Database Models Needed

### Workout Plan Model
```python
class WorkoutPlan:
    id
    member_id
    trainer_id (optional)
    plan_name
    description
    duration_weeks
    days_per_week
    start_date
    end_date
    status (active, completed, paused)
    exercises[] (relationship to WorkoutExercise)
    created_at
    updated_at
```

### Workout Exercise Model
```python
class WorkoutExercise:
    id
    workout_plan_id
    day_of_week (1-7)
    exercise_name
    muscle_groups
    sets
    reps
    weight (optional)
    rest_seconds
    instructions
    video_link (optional)
    order_in_workout
```

### Diet Plan Model
```python
class DietPlan:
    id
    member_id
    trainer_id (optional)
    plan_name
    goal (weight_loss, muscle_gain, maintenance)
    daily_calories
    protein_grams
    carbs_grams
    fats_grams
    duration_weeks
    start_date
    end_date
    status (active, completed, paused)
    meals[] (relationship to DietMeal)
    created_at
    updated_at
```

### Diet Meal Model
```python
class DietMeal:
    id
    diet_plan_id
    meal_type (breakfast, lunch, dinner, snack)
    meal_name
    ingredients
    calories
    protein_grams
    carbs_grams
    fats_grams
    preparation_instructions
    recipe_link (optional)
    day_of_week (1-7, or null for daily)
    meal_time (optional)
```

### Trainer Assignment Model
```python
class TrainerAssignment:
    id
    member_id
    trainer_id
    gym_id
    assigned_date
    status (active, inactive)
    notes
    created_at
```

### Progress Log Model
```python
class ProgressLog:
    id
    member_id
    log_date
    weight
    body_measurements (JSON)
    workout_completed (boolean)
    diet_adherence (percentage)
    notes
    created_at
```

### Workout Log Model
```python
class WorkoutLog:
    id
    member_id
    workout_plan_id
    workout_date
    exercises_completed[] (JSON or relationship)
    duration_minutes
    notes
    created_at
```

---

## 12. API Endpoints Needed

### Member Data Endpoints
- `GET /api/members/me` - Get current member's full profile
- `PUT /api/members/me` - Update member profile
- `GET /api/members/me/subscription` - Get member's subscription

### Workout Plan Endpoints
- `GET /api/members/me/workout-plan` - Get current workout plan
- `GET /api/members/me/workout-plan/exercises` - Get workout exercises
- `POST /api/members/me/workout-log` - Log completed workout
- `GET /api/members/me/workout-history` - Get workout history

### Diet Plan Endpoints
- `GET /api/members/me/diet-plan` - Get current diet plan
- `GET /api/members/me/diet-plan/meals` - Get daily meals
- `POST /api/members/me/diet-log` - Log meal consumption
- `GET /api/members/me/diet-history` - Get diet adherence history

### Trainer Endpoints
- `GET /api/members/me/trainer` - Get assigned trainer
- `GET /api/members/me/trainer/sessions` - Get training sessions
- `POST /api/members/me/trainer/message` - Send message to trainer
- `POST /api/members/me/trainer/session-request` - Request session

### Progress Endpoints
- `GET /api/members/me/progress` - Get progress data
- `POST /api/members/me/progress/log` - Log progress (weight, measurements)
- `GET /api/members/me/progress/stats` - Get progress statistics
- `GET /api/members/me/achievements` - Get achievements and milestones

### Contest Endpoints (Already exists)
- `GET /api/contest/get_all_contests` - Get contests (filtered for member)
- `POST /api/participants/register` - Register for contest
- `GET /api/participants/check_registration` - Check registration status
- `GET /api/members/me/contests` - Get member's contests

---

## 13. Implementation Priority

### Phase 1 (Core Features)
1. ✅ Member authentication and login
2. ✅ Member sidebar with restricted navigation
3. ✅ Member dashboard home page
4. ✅ Contests page (already exists, needs member access)
5. Member profile page

### Phase 2 (Essential Features)
6. My Trainer page
7. Workout Plan page (basic view)
8. Diet Plan page (basic view)
9. My Progress page (basic tracking)

### Phase 3 (Enhanced Features)
10. Workout logging functionality
11. Diet meal logging
12. Progress tracking (weight, measurements)
13. Trainer communication
14. Notifications system

### Phase 4 (Advanced Features)
15. Progress charts and analytics
16. Achievement system
17. Workout exercise details and videos
18. Recipe library
19. Social features

---

## 14. UI/UX Guidelines

### Design System:
- **Theme**: Neumorphic design (consistent with owner dashboard)
- **Color Scheme**: 
  - Primary: Green (#67d18a)
  - Background: Light gray (#ecf0f3)
  - Text: Dark gray (#2d3748)
  - Accents: Indigo for contests, blue for workouts

### Components:
- Use consistent card layouts
- Neumorphic shadows for depth
- Responsive design (mobile-first)
- Loading states for all data fetching
- Error states with retry options
- Empty states with helpful messages

### Accessibility:
- Keyboard navigation support
- Screen reader friendly
- High contrast for important information
- Clear call-to-action buttons

---

## 15. Security Considerations

### Access Control:
- Members can only see their own data
- API endpoints must validate member_id from token
- No access to other members' information
- Restricted routes based on user role

### Data Privacy:
- Personal information is private
- Progress data is member-only
- Trainer assignments are visible to member and trainer only
- Contest leaderboards show member's own rank only

---

This design provides a comprehensive member experience while maintaining security and user-friendly navigation.

