import type { FieldError } from '../api/errors'
import { ACTIVITY_TYPES, type ActivityType } from '../types'

export type FieldErrors = Record<string, string>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}

  if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!password) {
    errors.password = 'Password is required'
  }

  return errors
}

export function validateRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {}

  if (name.trim().length < 2 || name.trim().length > 50) {
    errors.name = 'Name must have between 2 and 50 characters'
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (password.length < 8) {
    errors.password = 'Password must have at least 8 characters'
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

// Turns the errors array returned by the API into { field: message }
export function toFieldErrors(errors: FieldError[]): FieldErrors {
  const result: FieldErrors = {}
  for (const error of errors) {
    if (error.field && !result[error.field]) {
      result[error.field] = error.message
    }
  }
  return result
}

export interface WorkoutFormValues {
  title: string
  activityType: ActivityType
  durationMinutes: string
  caloriesBurned: string
  date: string
  notes: string
}

export function validateWorkout(values: WorkoutFormValues): FieldErrors {
  const errors: FieldErrors = {}

  const title = values.title.trim()
  if (title.length < 1 || title.length > 100) {
    errors.title = 'Title must have between 1 and 100 characters'
  }

  if (!ACTIVITY_TYPES.includes(values.activityType)) {
    errors.activityType = 'Choose a category'
  }

  const duration = Number(values.durationMinutes)
  if (
    values.durationMinutes.trim() === '' ||
    !Number.isInteger(duration) ||
    duration < 1 ||
    duration > 1440
  ) {
    errors.durationMinutes = 'Duration must be a whole number between 1 and 1440 minutes'
  }

  const calories = Number(values.caloriesBurned)
  if (
    values.caloriesBurned.trim() === '' ||
    Number.isNaN(calories) ||
    calories < 0 ||
    calories > 20000
  ) {
    errors.caloriesBurned = 'Calories must be between 0 and 20000'
  }

  if (!values.date || Number.isNaN(new Date(values.date).getTime())) {
    errors.date = 'Choose a valid date'
  }

  if (values.notes.trim().length > 500) {
    errors.notes = 'Notes must have at most 500 characters'
  }

  return errors
}