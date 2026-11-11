import { useState, type FormEvent } from 'react'
import { getActivityMeta } from '../../config/activityImages'
import { ACTIVITY_TYPES, type ActivityType, type Workout, type WorkoutInput } from '../../types'
import { validateWorkout, type FieldErrors, type WorkoutFormValues } from '../../utils/validation'
import { Button } from '../ui/Button'
import { ErrorMessage } from '../ui/ErrorMessage'
import { SelectField } from '../ui/SelectField'
import { TextAreaField } from '../ui/TextAreaField'
import { TextField } from '../ui/TextField'
import { ActivityImage } from './ActivityImage'

interface WorkoutFormProps {
  workout?: Workout
  submitting: boolean
  formError: string
  serverErrors: FieldErrors
  onSubmit: (values: WorkoutInput) => void
  onCancel: () => void
}

function toFormValues(workout?: Workout): WorkoutFormValues {
  if (!workout) {
    return {
      title: '',
      activityType: 'Cardio',
      durationMinutes: '',
      caloriesBurned: '',
      date: new Date().toLocaleDateString('en-CA'), // today, as YYYY-MM-DD
      notes: '',
    }
  }

  return {
    title: workout.title,
    activityType: workout.activityType,
    durationMinutes: String(workout.durationMinutes),
    caloriesBurned: String(workout.caloriesBurned),
    date: workout.date.slice(0, 10),
    notes: workout.notes ?? '',
  }
}

export function WorkoutForm({
  workout,
  submitting,
  formError,
  serverErrors,
  onSubmit,
  onCancel,
}: WorkoutFormProps) {
  const [values, setValues] = useState<WorkoutFormValues>(() => toFormValues(workout))
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})

  function update<K extends keyof WorkoutFormValues>(key: K, value: WorkoutFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const errorFor = (field: string) => clientErrors[field] ?? serverErrors[field]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateWorkout(values)
    setClientErrors(errors)
    if (Object.keys(errors).length > 0) return

    onSubmit({
      title: values.title.trim(),
      activityType: values.activityType,
      durationMinutes: Number(values.durationMinutes),
      caloriesBurned: Number(values.caloriesBurned),
      date: values.date,
      notes: values.notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <ErrorMessage message={formError} />}

      <TextField
        label="Title"
        placeholder="Morning run"
        value={values.title}
        onChange={(event) => update('title', event.target.value)}
        error={errorFor('title')}
      />

      <div className="flex items-start gap-3">
        <SelectField
          label="Category"
          className="flex-1"
          value={values.activityType}
          onChange={(event) => update('activityType', event.target.value as ActivityType)}
          error={errorFor('activityType')}
        >
          {ACTIVITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {getActivityMeta(type).label}
            </option>
          ))}
        </SelectField>
        <div className="mt-7 w-24 shrink-0 overflow-hidden rounded-xl">
          <ActivityImage type={values.activityType} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Duration (minutes)"
          type="number"
          inputMode="numeric"
          min={1}
          max={1440}
          value={values.durationMinutes}
          onChange={(event) => update('durationMinutes', event.target.value)}
          error={errorFor('durationMinutes')}
        />
        <TextField
          label="Calories burned"
          type="number"
          inputMode="numeric"
          min={0}
          max={20000}
          value={values.caloriesBurned}
          onChange={(event) => update('caloriesBurned', event.target.value)}
          error={errorFor('caloriesBurned')}
        />
      </div>

      <TextField
        label="Date"
        type="date"
        value={values.date}
        onChange={(event) => update('date', event.target.value)}
        error={errorFor('date')}
      />

      <TextAreaField
        label="Notes (optional)"
        placeholder="How did it go?"
        value={values.notes}
        onChange={(event) => update('notes', event.target.value)}
        error={errorFor('notes')}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {workout ? 'Save changes' : 'Create workout'}
        </Button>
      </div>
    </form>
  )
}