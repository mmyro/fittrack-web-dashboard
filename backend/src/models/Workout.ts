import { Schema, Types, model } from 'mongoose';

export const ACTIVITY_TYPES = ['Cardio', 'Strength', 'Football', 'Gym', 'Other'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface IWorkout {
  user: Types.ObjectId;
  title: string;
  activityType: ActivityType;
  durationMinutes: number;
  caloriesBurned: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    activityType: { type: String, required: true, enum: ACTIVITY_TYPES },
    durationMinutes: { type: Number, required: true, min: 1, max: 1440 },
    caloriesBurned: { type: Number, required: true, min: 0, max: 20000 },
    date: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Fast listing of one user's workouts, newest first
workoutSchema.index({ user: 1, date: -1 });

export const Workout = model<IWorkout>('Workout', workoutSchema);