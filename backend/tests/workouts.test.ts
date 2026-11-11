import request from 'supertest';
import app from '../src/app';
import { authHeader, createUserAndLogin, validWorkout } from './helpers';

async function createWorkout(token: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/api/workouts')
    .set(authHeader(token))
    .send({ ...validWorkout, ...overrides });
  return res.body.workout as { _id: string };
}

describe('workouts: authentication', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).post('/api/workouts').send(validWorkout);
    expect(res.status).toBe(401);
  });
});

describe('workouts: create and validate', () => {
  it('creates a workout owned by the authenticated user', async () => {
    const token = await createUserAndLogin();
    const res = await request(app).post('/api/workouts').set(authHeader(token)).send(validWorkout);

    expect(res.status).toBe(201);
    expect(res.body.workout.title).toBe('Morning run');
    expect(res.body.workout.user).toBeDefined();
  });

  it('ignores a user id sent in the body', async () => {
    const token = await createUserAndLogin();
    const res = await request(app)
      .post('/api/workouts')
      .set(authHeader(token))
      .send({ ...validWorkout, user: '000000000000000000000000' });

    expect(res.status).toBe(201);
    expect(res.body.workout.user).not.toBe('000000000000000000000000');
  });

  it('rejects an unknown category and an invalid duration', async () => {
    const token = await createUserAndLogin();
    const res = await request(app)
      .post('/api/workouts')
      .set(authHeader(token))
      .send({ ...validWorkout, activityType: 'Strength', durationMinutes: 0 });

    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toEqual(expect.arrayContaining(['activityType', 'durationMinutes']));
  });

  it('accepts every valid category', async () => {
    const token = await createUserAndLogin();
    for (const activityType of ['Cardio', 'Gym', 'Football', 'Flexibility', 'Other']) {
      const res = await request(app)
        .post('/api/workouts')
        .set(authHeader(token))
        .send({ ...validWorkout, activityType });
      expect(res.status).toBe(201);
    }
  });
});

describe('workouts: read, update and delete', () => {
  it('lists and fetches the own workout', async () => {
    const token = await createUserAndLogin();
    const workout = await createWorkout(token);

    const list = await request(app).get('/api/workouts').set(authHeader(token));
    expect(list.status).toBe(200);
    expect(list.body.workouts).toHaveLength(1);

    const one = await request(app).get(`/api/workouts/${workout._id}`).set(authHeader(token));
    expect(one.status).toBe(200);
    expect(one.body.workout._id).toBe(workout._id);
  });

  it('updates a workout without creating a new one', async () => {
    const token = await createUserAndLogin();
    const workout = await createWorkout(token);

    const res = await request(app)
      .put(`/api/workouts/${workout._id}`)
      .set(authHeader(token))
      .send({ ...validWorkout, durationMinutes: 50 });
    expect(res.status).toBe(200);
    expect(res.body.workout.durationMinutes).toBe(50);

    const list = await request(app).get('/api/workouts').set(authHeader(token));
    expect(list.body.workouts).toHaveLength(1);
  });

  it('deletes a workout and then returns 404', async () => {
    const token = await createUserAndLogin();
    const workout = await createWorkout(token);

    const del = await request(app).delete(`/api/workouts/${workout._id}`).set(authHeader(token));
    expect(del.status).toBe(200);

    const after = await request(app).get(`/api/workouts/${workout._id}`).set(authHeader(token));
    expect(after.status).toBe(404);
  });

  it('rejects a malformed id with 400', async () => {
    const token = await createUserAndLogin();
    const res = await request(app).get('/api/workouts/abc').set(authHeader(token));
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid workout id');
  });
});

describe('workouts: data isolation between users', () => {
  it('hides, protects and keeps the workout of another user', async () => {
    const rui = await createUserAndLogin('rui@test.com', 'Rui Costa');
    const ana = await createUserAndLogin('ana@test.com', 'Ana Silva');
    const workout = await createWorkout(rui);
    const url = `/api/workouts/${workout._id}`;

    expect((await request(app).get(url).set(authHeader(ana))).status).toBe(404);
    expect(
      (await request(app).put(url).set(authHeader(ana)).send(validWorkout)).status
    ).toBe(404);
    expect((await request(app).delete(url).set(authHeader(ana))).status).toBe(404);

    const anaList = await request(app).get('/api/workouts').set(authHeader(ana));
    expect(anaList.body.workouts).toEqual([]);

    // The workout is still there for its owner
    expect((await request(app).get(url).set(authHeader(rui))).status).toBe(200);
  });
});

describe('workouts: search, filter and pagination', () => {
  async function seed(token: string) {
    await createWorkout(token, { title: 'Morning run', activityType: 'Cardio', date: '2026-11-11' });
    await createWorkout(token, { title: 'Leg day', activityType: 'Gym', date: '2026-11-10' });
    await createWorkout(token, { title: 'Evening run', activityType: 'Cardio', date: '2026-11-08' });
  }

  it('filters by category', async () => {
    const token = await createUserAndLogin();
    await seed(token);

    const res = await request(app).get('/api/workouts?type=Cardio').set(authHeader(token));
    expect(res.body.workouts).toHaveLength(2);
  });

  it('searches by title without distinguishing case', async () => {
    const token = await createUserAndLogin();
    await seed(token);

    const res = await request(app).get('/api/workouts?search=RUN').set(authHeader(token));
    expect(res.body.workouts).toHaveLength(2);
  });

  it('combines filter and search', async () => {
    const token = await createUserAndLogin();
    await seed(token);

    const res = await request(app)
      .get('/api/workouts?type=Cardio&search=morning')
      .set(authHeader(token));
    expect(res.body.workouts).toHaveLength(1);
    expect(res.body.workouts[0].title).toBe('Morning run');
  });

  it('paginates the results', async () => {
    const token = await createUserAndLogin();
    await seed(token);

    const page1 = await request(app).get('/api/workouts?limit=2&page=1').set(authHeader(token));
    expect(page1.body.workouts).toHaveLength(2);
    expect(page1.body.pagination).toMatchObject({ total: 3, totalPages: 2 });

    const page2 = await request(app).get('/api/workouts?limit=2&page=2').set(authHeader(token));
    expect(page2.body.workouts).toHaveLength(1);
  });

  it('treats regex characters as plain text', async () => {
    const token = await createUserAndLogin();
    await seed(token);

    const res = await request(app).get('/api/workouts?search=.*').set(authHeader(token));
    expect(res.status).toBe(200);
    expect(res.body.workouts).toEqual([]);
  });

  it('rejects an invalid category and an excessive limit', async () => {
    const token = await createUserAndLogin();
    expect((await request(app).get('/api/workouts?type=Yoga').set(authHeader(token))).status).toBe(400);
    expect((await request(app).get('/api/workouts?limit=500').set(authHeader(token))).status).toBe(400);
  });
});

describe('workouts: statistics', () => {
  it('returns totals, categories and 8 weeks for the own workouts only', async () => {
    const rui = await createUserAndLogin('rui@test.com', 'Rui Costa');
    const ana = await createUserAndLogin('ana@test.com', 'Ana Silva');
    const today = new Date().toISOString().slice(0, 10);

    await createWorkout(rui, { durationMinutes: 45, caloriesBurned: 420, date: today });
    await createWorkout(rui, {
      activityType: 'Gym',
      durationMinutes: 60,
      caloriesBurned: 380,
      date: today,
    });
    await createWorkout(ana, { durationMinutes: 999, caloriesBurned: 9999, date: today });

    const res = await request(app).get('/api/workouts/stats').set(authHeader(rui));

    expect(res.status).toBe(200);
    expect(res.body.totalWorkouts).toBe(2);
    expect(res.body.totalMinutes).toBe(105);
    expect(res.body.totalCalories).toBe(800);
    expect(res.body.byType).toHaveLength(5);
    expect(res.body.byType.find((t: { activityType: string }) => t.activityType === 'Cardio').count).toBe(1);
    expect(res.body.weekly).toHaveLength(8);
  });

  it('returns zeros for a user without workouts', async () => {
    const token = await createUserAndLogin();
    const res = await request(app).get('/api/workouts/stats').set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.totalWorkouts).toBe(0);
    expect(res.body.weekly).toHaveLength(8);
  });

  it('requires authentication', async () => {
    const res = await request(app).get('/api/workouts/stats');
    expect(res.status).toBe(401);
  });
});