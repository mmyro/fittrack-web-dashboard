import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FALLBACK_IMAGE } from '../../config/activityImages'
import type { Workout } from '../../types'
import { WorkoutCard } from './WorkoutCard'

const workout: Workout = {
  _id: '1',
  user: 'u1',
  title: 'Leg day',
  activityType: 'Gym',
  durationMinutes: 60,
  caloriesBurned: 380,
  date: '2026-11-10T00:00:00.000Z',
  notes: 'Squats and lunges',
  createdAt: '2026-11-10T10:00:00.000Z',
  updatedAt: '2026-11-10T10:00:00.000Z',
}

describe('WorkoutCard', () => {
  it('shows the workout data', () => {
    render(<WorkoutCard workout={workout} />)

    expect(screen.getByText('Leg day')).toBeInTheDocument()
    expect(screen.getByText('60 min')).toBeInTheDocument()
    expect(screen.getByText('380 kcal')).toBeInTheDocument()
    expect(screen.getByText('10 Nov 2026')).toBeInTheDocument()
    expect(screen.getByText('Squats and lunges')).toBeInTheDocument()
  })

  it('shows the image and the badge of its category', () => {
    render(<WorkoutCard workout={workout} />)

    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/activities/gym.jpg')
    expect(screen.getByText('Gym')).toBeInTheDocument()
  })

  it('shows the fallback image when the category image fails to load', () => {
    render(<WorkoutCard workout={workout} />)

    fireEvent.error(screen.getByRole('img'))

    expect(screen.getByRole('img')).toHaveAttribute('src', FALLBACK_IMAGE)
  })

  it('shows the fallback image for an unknown category', () => {
    render(<WorkoutCard workout={{ ...workout, activityType: 'Strength' as never }} />)

    expect(screen.getByRole('img')).toHaveAttribute('src', FALLBACK_IMAGE)
  })

  it('only shows the Edit and Delete buttons when the actions are provided', () => {
    const { rerender } = render(<WorkoutCard workout={workout} />)
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()

    rerender(<WorkoutCard workout={workout} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls the actions with the workout', async () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<WorkoutCard workout={workout} onEdit={onEdit} onDelete={onDelete} />)

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onEdit).toHaveBeenCalledWith(workout)
    expect(onDelete).toHaveBeenCalledWith(workout)
  })
})