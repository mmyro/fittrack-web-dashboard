export const ACTIVITY_TYPES = ['Cardio', 'Gym', 'Football', 'Flexibility', 'Other'] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export interface User {
  id: string
  name: string
  email: string
}

export interface Workout {
  _id: string
  user: string
  title: string
  activityType: ActivityType
  durationMinutes: number
  caloriesBurned: number
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface WorkoutInput {
  title: string
  activityType: ActivityType
  durationMinutes: number
  caloriesBurned: number
  date: string
  notes?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface WorkoutStats {
  totalWorkouts: number
  totalCalories: number
  totalMinutes: number
  byType: { activityType: ActivityType; count: number }[]
  weekly: { weekStart: string; workouts: number; minutes: number; calories: number }[]
}