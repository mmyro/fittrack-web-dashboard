import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActivityFilter } from './ActivityFilter'

describe('ActivityFilter', () => {
  it('shows All and the five categories', () => {
    render(<ActivityFilter value={undefined} onChange={() => {}} />)

    for (const name of ['All', 'Cardio', 'Gym', 'Football', 'Flexibility', 'Other']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('selects a category', async () => {
    const onChange = vi.fn()
    render(<ActivityFilter value={undefined} onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cardio' }))

    expect(onChange).toHaveBeenCalledWith('Cardio')
  })

  it('removes the filter when the active category is clicked again', async () => {
    const onChange = vi.fn()
    render(<ActivityFilter value="Cardio" onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cardio' }))

    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})