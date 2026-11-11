import { FilterQuery, Types, isValidObjectId } from 'mongoose';
import { ACTIVITY_TYPES, IWorkout, Workout } from '../models/Workout';
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

const WEEKS = 8;
const DAY_MS = 24 * 60 * 60 * 1000;

// Monday 00:00 (UTC) of the week that contains the given date
function startOfWeekUTC(date: Date): Date {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - daysSinceMonday)
  );
}

export const getStats = asyncHandler(async (req, res) => {
  const userId = new Types.ObjectId(req.user!.id);
  const firstWeek = new Date(startOfWeekUTC(new Date()).getTime() - (WEEKS - 1) * 7 * DAY_MS);

  const [totals, byTypeRaw, weeklyRaw] = await Promise.all([
    Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$caloriesBurned' },
          totalMinutes: { $sum: '$durationMinutes' },
        },
      },
    ]),
    Workout.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$activityType', count: { $sum: 1 } } },
    ]),
    Workout.aggregate([
      { $match: { user: userId, date: { $gte: firstWeek } } },
      {
        $group: {
          _id: { $dateTrunc: { date: '$date', unit: 'week', startOfWeek: 'monday' } },
          workouts: { $sum: 1 },
          minutes: { $sum: '$durationMinutes' },
          calories: { $sum: '$caloriesBurned' },
        },
      },
    ]),
  ]);

  // Every category appears in the result, even with zero workouts
  const byType = ACTIVITY_TYPES.map((type) => ({
    activityType: type,
    count: byTypeRaw.find((item) => item._id === type)?.count ?? 0,
  }));

  // The last 8 weeks always appear, so the chart has no gaps
  const weekly = Array.from({ length: WEEKS }, (_, index) => {
    const weekStart = new Date(firstWeek.getTime() + index * 7 * DAY_MS);
    const key = weekStart.toISOString().slice(0, 10);
    const found = weeklyRaw.find((item) => item._id.toISOString().slice(0, 10) === key);
    return {
      weekStart: key,
      workouts: found?.workouts ?? 0,
      minutes: found?.minutes ?? 0,
      calories: found?.calories ?? 0,
    };
  });

  res.status(200).json({
    totalWorkouts: totals[0]?.totalWorkouts ?? 0,
    totalCalories: totals[0]?.totalCalories ?? 0,
    totalMinutes: totals[0]?.totalMinutes ?? 0,
    byType,
    weekly,
  });
});