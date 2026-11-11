import { WorkoutCard } from './WorkoutCard'
import type { Workout } from '../../types'

interface WorkoutListProps {
  workouts: Workout[]
  onEdit?: (workout: Workout) => void
  onDelete?: (workout: Workout) => void
}

export function WorkoutList({ workouts, onEdit, onDelete }: WorkoutListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {workouts.map((workout) => (
        <WorkoutCard key={workout._id} workout={workout} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}