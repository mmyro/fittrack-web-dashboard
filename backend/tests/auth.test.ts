import request from 'supertest';
import app from '../src/app';
import { authHeader, createUserAndLogin } from './helpers';

const newUser = { name: 'Rui Costa', email: 'rui@test.com', password: '12345678' };

describe('POST /api/auth/register', () => {
  it('creates a user and never returns the password hash', async () => {
    const res = await request(app).post('/api/auth/register').send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('rui@test.com');
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects a duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send(newUser);
    const res = await request(app).post('/api/auth/register').send(newUser);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Email already registered');
  });

  it('rejects invalid data with 400 and field errors', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'email', 'password']));
  });

  it('rejects an empty body with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send('{ "name": }');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid JSON body');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(newUser);
  });

  it('returns a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: newUser.email, password: newUser.password });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.email).toBe(newUser.email);
  });

  it('rejects a wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: newUser.email, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('gives the same 401 message for an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: '12345678' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('rejects invalid input with 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: '' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Authentication required');
  });

  it('rejects a header without the Bearer prefix', async () => {
    const token = await createUserAndLogin();
    const res = await request(app).get('/api/auth/me').set('Authorization', token);
    expect(res.status).toBe(401);
  });

  it('rejects an invented token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer abc123');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('rejects a token with a tampered signature', async () => {
    const token = await createUserAndLogin();
    const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
    const res = await request(app).get('/api/auth/me').set(authHeader(tampered));
    expect(res.status).toBe(401);
  });

  it('returns the authenticated user', async () => {
    const token = await createUserAndLogin();
    const res = await request(app).get('/api/auth/me').set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('rui@test.com');
  });
});