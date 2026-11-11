import { z } from 'zod';
import { ACTIVITY_TYPES } from '../models/Workout';

export const workoutSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must have at most 100 characters'),
  activityType: z.enum(ACTIVITY_TYPES, {
    message: `Activity type must be one of: ${ACTIVITY_TYPES.join(', ')}`,
  }),
  durationMinutes: z
    .number({ message: 'Duration must be a number' })
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration must be at most 1440 minutes'),
  caloriesBurned: z
    .number({ message: 'Calories must be a number' })
    .min(0, 'Calories cannot be negative')
    .max(20000, 'Calories must be at most 20000'),
  date: z.coerce.date({ message: 'Invalid date' }),
  notes: z.string().trim().max(500, 'Notes must have at most 500 characters').optional(),
});