import { getActivityMeta } from '../../config/activityImages'
import { formatDate } from '../../utils/format'
import { Button } from '../ui/Button'
import { ClockIcon, FlameIcon } from '../ui/Icons'
import { ActivityImage } from './ActivityImage'
import type { Workout } from '../../types'

interface WorkoutCardProps {
  workout: Workout
  onEdit?: (workout: Workout) => void
  onDelete?: (workout: Workout) => void
}

export function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  const meta = getActivityMeta(workout.activityType)

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative">
        <ActivityImage type={workout.activityType} />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${meta.badgeClass}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-slate-900">{workout.title}</h3>
        <p className="text-sm text-slate-500">{formatDate(workout.date)}</p>

        <div className="mt-4 flex gap-5 text-sm text-slate-700">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-emerald-700" />
            {workout.durationMinutes} min
          </span>
          <span className="flex items-center gap-1.5">
            <FlameIcon className="h-4 w-4 text-orange-500" />
            {workout.caloriesBurned} kcal
          </span>
        </div>

        {workout.notes && <p className="mt-3 line-clamp-2 text-sm text-slate-600">{workout.notes}</p>}

        {(onEdit || onDelete) && (
          <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={() => onEdit(workout)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => onDelete(workout)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}