import request from 'supertest';
import app from '../src/app';

export async function createUserAndLogin(
  email = 'rui@test.com',
  name = 'Rui Costa',
  password = '12345678'
): Promise<string> {
  await request(app).post('/api/auth/register').send({ name, email, password });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token as string;
}

export const validWorkout = {
  title: 'Morning run',
  activityType: 'Cardio',
  durationMinutes: 45,
  caloriesBurned: 420,
  date: '2026-11-11',
  notes: '5 km along the river',
};

export function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}