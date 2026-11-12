import {
  toFieldErrors,
  validateLogin,
  validateRegister,
  validateWorkout,
  type WorkoutFormValues,
} from './validation'

const validWorkout: WorkoutFormValues = {
  title: 'Morning run',
  activityType: 'Cardio',
  durationMinutes: '45',
  caloriesBurned: '420',
  date: '2026-11-11',
  notes: '',
}

describe('validateLogin', () => {
  it('accepts valid credentials', () => {
    expect(validateLogin('rui@test.com', 'secret')).toEqual({})
  })

  it('rejects an invalid email and an empty password', () => {
    const errors = validateLogin('not-an-email', '')
    expect(errors.email).toBeDefined()
    expect(errors.password).toBeDefined()
  })
})

describe('validateRegister', () => {
  it('accepts valid data', () => {
    expect(validateRegister('Rui Costa', 'rui@test.com', '12345678', '12345678')).toEqual({})
  })

  it('rejects a short name, a short password and a different confirmation', () => {
    const errors = validateRegister('A', 'rui@test.com', '123', '456')
    expect(errors.name).toBeDefined()
    expect(errors.password).toBeDefined()
    expect(errors.confirmPassword).toBeDefined()
  })
})

describe('validateWorkout', () => {
  it('accepts a valid workout', () => {
    expect(validateWorkout(validWorkout)).toEqual({})
  })

  it('rejects empty required fields', () => {
    const errors = validateWorkout({
      ...validWorkout,
      title: '',
      durationMinutes: '',
      caloriesBurned: '',
    })
    expect(errors.title).toBeDefined()
    expect(errors.durationMinutes).toBeDefined()
    expect(errors.caloriesBurned).toBeDefined()
  })

  it('rejects values outside the limits', () => {
    expect(validateWorkout({ ...validWorkout, durationMinutes: '0' }).durationMinutes).toBeDefined()
    expect(validateWorkout({ ...validWorkout, durationMinutes: '1441' }).durationMinutes).toBeDefined()
    expect(validateWorkout({ ...validWorkout, durationMinutes: '45.5' }).durationMinutes).toBeDefined()
    expect(validateWorkout({ ...validWorkout, caloriesBurned: '-5' }).caloriesBurned).toBeDefined()
    expect(validateWorkout({ ...validWorkout, caloriesBurned: '20001' }).caloriesBurned).toBeDefined()
  })

  it('rejects notes with more than 500 characters', () => {
    expect(validateWorkout({ ...validWorkout, notes: 'a'.repeat(501) }).notes).toBeDefined()
  })
})

describe('toFieldErrors', () => {
  it('keeps the first message of each field', () => {
    const result = toFieldErrors([
      { field: 'email', message: 'Invalid email address' },
      { field: 'email', message: 'Another message' },
      { field: 'name', message: 'Too short' },
    ])
    expect(result).toEqual({ email: 'Invalid email address', name: 'Too short' })
  })
})