// types/member.ts
export interface Member {
    id: string;
    name: string;
    email: string;
    subscription: Subscription;
    stats: MemberStats;
    profilePhoto?: string;
  }
  
  export interface Subscription {
    status: 'Active' | 'Expired' | 'Pending';
    daysRemaining: number;
    plan: string;
    startDate: string;
    endDate: string;
  }
  
  export interface MemberStats {
    weight: number;
    height: number;
    bmi: number;
    joinDate: string;
  }
  
  export interface DashboardStats {
    activeDays: number;
    daysRemaining: number;
    workoutsThisWeek: WorkoutCompletion;
    contestsJoined: number;
  }
  
  export interface WorkoutCompletion {
    completed: number;
    total: number;
  }
  
  export interface ScheduleItem {
    type: 'workout' | 'trainer' | 'diet';
    title: string;
    time: string;
    duration: string;
    completed: boolean;
  }
  
  export interface WorkoutPlan {
    name: string;
    duration: string;
    progress: number;
    daysPerWeek: number;
    weeklySchedule: WorkoutDay[];
    exercises: Record<number, Exercise[]>;
  }
  
  export interface WorkoutDay {
    day: number;
    name: string;
    completed: boolean;
  }
  
  export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    weight: string;
    rest: string;
    personalBest: string;
  }

  export interface DietPlan {
    name: string;
    duration: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    meals: Meal[];
  }

  export interface Meal {
    id: string;
    name: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    foods: string[];
    completed: boolean;
  }

  export interface Trainer {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    experience: number;
    photo?: string;
    bio: string;
    nextSession?: string;
  }

  export interface Contest {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    participants: number;
    prize: string;
    joined: boolean;
    myRank?: number;
    myScore?: number;
  }

  export interface ProgressEntry {
    date: string;
    weight: number;
    bodyFat?: number;
    muscleMass?: number;
    measurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      arms?: number;
      thighs?: number;
    };
  }