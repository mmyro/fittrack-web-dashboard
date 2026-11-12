import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Workout, type ActivityType } from '../models/Workout';

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@fittrack.test',
  password: 'FitTrack#Demo26',
};

const templates: {
  title: string;
  activityType: ActivityType;
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
}[] = [
  { title: 'Morning run', activityType: 'Cardio', durationMinutes: 40, caloriesBurned: 400, notes: '5 km along the river' },
  { title: 'Leg day', activityType: 'Gym', durationMinutes: 60, caloriesBurned: 380 },
  { title: 'Friday match', activityType: 'Football', durationMinutes: 90, caloriesBurned: 700, notes: '5-a-side with friends' },
  { title: 'Yoga flow', activityType: 'Flexibility', durationMinutes: 45, caloriesBurned: 150 },
  { title: 'Evening run', activityType: 'Cardio', durationMinutes: 30, caloriesBurned: 290 },
  { title: 'Upper body', activityType: 'Gym', durationMinutes: 55, caloriesBurned: 340, notes: 'Bench press and rows' },
  { title: 'Cycling commute', activityType: 'Cardio', durationMinutes: 35, caloriesBurned: 310 },
  { title: 'Swimming session', activityType: 'Other', durationMinutes: 50, caloriesBurned: 450 },
];

async function seed(): Promise<void> {
  await mongoose.connect(env.mongoUri);

  let user = await User.findOne({ email: DEMO_USER.email });
  if (!user) {
    const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
    user = await User.create({ name: DEMO_USER.name, email: DEMO_USER.email, passwordHash });
  }

  // Only the demo user's workouts are replaced, other users are never touched
  await Workout.deleteMany({ user: user._id });

  const now = new Date();
  const workouts = Array.from({ length: 24 }, (_, index) => {
    const template = templates[index % templates.length];
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - Math.floor(index * 2.3))
    );
    return {
      ...template,
      durationMinutes: template.durationMinutes + (index % 3) * 5,
      caloriesBurned: template.caloriesBurned + (index % 3) * 30,
      user: user._id,
      date,
    };
  });

  await Workout.insertMany(workouts);

  console.log(`Seed done: ${workouts.length} workouts for ${DEMO_USER.email}`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});