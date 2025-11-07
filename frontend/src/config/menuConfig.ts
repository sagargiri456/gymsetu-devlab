// config/menuConfig.ts
import { MenuItem } from '@/components/shared/UnifiedSidebar';

// Member menu items
export const memberMenuItems: MenuItem[] = [
  { path: '/member', icon: 'dashboard', label: 'Dashboard' },
  { path: '/member/workout-plan', icon: 'fitness_center', label: 'Workout Plan' },
  { path: '/member/diet-plan', icon: 'restaurant', label: 'Diet Plan' },
  { path: '/member/my-trainer', icon: 'person', label: 'My Trainer' },
  { path: '/member/contests', icon: 'emoji_events', label: 'Contests' },
  { path: '/member/progress', icon: 'trending_up', label: 'My Progress' },
  { path: '/member/profile', icon: 'account_circle', label: 'My Profile' },
  { path: '/member/settings', icon: 'settings', label: 'Settings' },
];

// Owner menu items
export const ownerMenuItems: MenuItem[] = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/dashboard/members', icon: 'people', label: 'Members' },
  { path: '/dashboard/trainers', icon: 'fitness_center', label: 'Trainers' },
  { path: '/dashboard/subscriptions', icon: 'card_membership', label: 'Subscriptions' },
  { path: '/dashboard/contest', icon: 'emoji_events', label: 'Contests' },
  { path: '/dashboard/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  { path: '/dashboard/settings', icon: 'settings', label: 'Settings' },
];

// Trainer menu items (to be defined when trainer pages are created)
export const trainerMenuItems: MenuItem[] = [
  { path: '/trainer', icon: 'dashboard', label: 'Dashboard' },
  { path: '/trainer/my-members', icon: 'people', label: 'My Members' },
  { path: '/trainer/workouts', icon: 'fitness_center', label: 'Workouts' },
  { path: '/trainer/schedule', icon: 'calendar_today', label: 'Schedule' },
  { path: '/trainer/profile', icon: 'account_circle', label: 'Profile' },
  { path: '/trainer/settings', icon: 'settings', label: 'Settings' },
];

