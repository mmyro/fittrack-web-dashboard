import { useState } from 'react'
import { getApiError } from '../../api/errors'
import { workoutService } from '../../api/workout.service'
import { toFieldErrors, type FieldErrors } from '../../utils/validation'
import { Modal } from '../ui/Modal'
import { WorkoutForm } from './WorkoutForm'
import type { Workout, WorkoutInput } from '../../types'

interface WorkoutFormModalProps {
  workout?: Workout
  onClose: () => void
  onSaved: (message: string) => void
}

export function WorkoutFormModal({ workout, onClose, onSaved }: WorkoutFormModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [serverErrors, setServerErrors] = useState<FieldErrors>({})

  async function handleSubmit(values: WorkoutInput) {
    setSubmitting(true)
    setFormError('')
    setServerErrors({})

    try {
      if (workout) {
        await workoutService.update(workout._id, values)
        onSaved('Workout updated')
      } else {
        await workoutService.create(values)
        onSaved('Workout created')
      }
    } catch (error) {
      const info = getApiError(error)
      setFormError(info.message)
      setServerErrors(toFieldErrors(info.errors))
      setSubmitting(false)
    }
  }

  return (
    <Modal title={workout ? 'Edit workout' : 'New workout'} onClose={onClose}>
      <WorkoutForm
        workout={workout}
        submitting={submitting}
        formError={formError}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}