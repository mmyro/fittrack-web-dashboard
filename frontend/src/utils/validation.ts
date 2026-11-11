import type { FieldError } from '../api/errors'

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