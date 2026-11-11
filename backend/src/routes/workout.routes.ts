import { Router } from 'express';
import {
  createWorkout,
  deleteWorkout,
  getWorkoutById,
  getWorkouts,
  updateWorkout,
} from '../controllers/workout.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { workoutSchema } from '../validators/workout.validator';

const router = Router();

// Every workout route requires authentication
router.use(protect);

router.get('/', getWorkouts);
router.post('/', validate(workoutSchema), createWorkout);
router.get('/:id', getWorkoutById);
router.put('/:id', validate(workoutSchema), updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;