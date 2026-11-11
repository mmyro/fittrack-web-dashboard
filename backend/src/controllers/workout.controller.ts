import { isValidObjectId } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { IWorkout, Workout } from '../models/Workout';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

function assertValidId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid workout id');
  }
}

export const createWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.create({ ...req.body, user: req.user!.id });
  res.status(201).json({ workout });
});

export const getWorkouts = asyncHandler(async (req, res) => {
  const { type, search, page, limit } = res.locals.query as {
    type?: string;
    search?: string;
    page: number;
    limit: number;
  };

  const filter: FilterQuery<IWorkout> = { user: req.user!.id };

  if (type) {
    filter.activityType = type;
  }

  if (search) {
    // Escape regex special characters so the search is always a plain text match
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.title = { $regex: escaped, $options: 'i' };
  }

  const [workouts, total] = await Promise.all([
    Workout.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Workout.countDocuments(filter),
  ]);

  res.status(200).json({
    workouts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getWorkoutById = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const workout = await Workout.findOne({ _id: req.params.id, user: req.user!.id });
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }

  res.status(200).json({ workout });
});

export const updateWorkout = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, user: req.user!.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }

  res.status(200).json({ workout });
});

export const deleteWorkout = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }

  res.status(200).json({ message: 'Workout deleted' });
});