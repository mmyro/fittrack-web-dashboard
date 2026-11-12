import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WorkoutForm } from './WorkoutForm'

function setup() {
  const onSubmit = vi.fn()
  render(
    <WorkoutForm
      submitting={false}
      formError=""
      serverErrors={{}}
      onSubmit={onSubmit}
      onCancel={() => {}}
    />,
  )
  return { onSubmit }
}

describe('WorkoutForm', () => {
  it('shows errors and does not submit when the form is empty', async () => {
    const { onSubmit } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Create workout' }))

    expect(screen.getByText(/Title must have between 1 and 100/)).toBeInTheDocument()
    expect(screen.getByText(/Duration must be a whole number/)).toBeInTheDocument()
    expect(screen.getByText(/Calories must be between/)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the values converted to the right types', async () => {
    const { onSubmit } = setup()

    await userEvent.type(screen.getByLabelText('Title'), '  Morning run ')
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Gym')
    await userEvent.type(screen.getByLabelText('Duration (minutes)'), '45')
    await userEvent.type(screen.getByLabelText('Calories burned'), '420')
    await userEvent.click(screen.getByRole('button', { name: 'Create workout' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Morning run',
        activityType: 'Gym',
        durationMinutes: 45,
        caloriesBurned: 420,
      }),
    )
  })

  it('changes the preview image when the category changes', async () => {
    setup()
    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/activities/cardio.jpg')

    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Football')

    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/activities/football.jpg')
  })
})