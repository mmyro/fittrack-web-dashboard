import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(50),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(8, 'Password must have at least 8 characters').max(100),
});