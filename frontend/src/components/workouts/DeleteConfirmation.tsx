import { useState } from 'react'
import { getApiError } from '../../api/errors'
import { workoutService } from '../../api/workout.service'
import { Button } from '../ui/Button'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Modal } from '../ui/Modal'
import type { Workout } from '../../types'

interface DeleteConfirmationProps {
  workout: Workout
  onClose: () => void
  onDeleted: () => void
}

export function DeleteConfirmation({ workout, onClose, onDeleted }: DeleteConfirmationProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError('')

    try {
      await workoutService.remove(workout._id)
      onDeleted()
    } catch (err) {
      setError(getApiError(err).message)
      setDeleting(false)
    }
  }

  return (
    <Modal title="Delete workout" onClose={onClose}>
      <div className="space-y-4">
        {error && <ErrorMessage message={error} />}
        <p className="text-slate-700">
          Are you sure you want to delete <strong>{workout.title}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}