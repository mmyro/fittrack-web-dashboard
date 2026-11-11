import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);

export default router;