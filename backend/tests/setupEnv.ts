// Runs before the app is imported: env.ts refuses to start without JWT_SECRET
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-used-only-by-jest';
process.env.JWT_EXPIRES_IN = '1h';