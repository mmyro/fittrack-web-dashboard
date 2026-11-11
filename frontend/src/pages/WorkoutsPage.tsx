import { useCallback, useEffect, useState } from 'react'
import { getApiError } from '../api/errors'
import { workoutService } from '../api/workout.service'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { SearchIcon } from '../components/ui/Icons'
import { LoadingState } from '../components/ui/LoadingState'
import { Pagination } from '../components/ui/Pagination'
import { Toast, type Notice } from '../components/ui/Toast'
import { ActivityFilter } from '../components/workouts/ActivityFilter'
import { DeleteConfirmation } from '../components/workouts/DeleteConfirmation'
import { WorkoutFormModal } from '../components/workouts/WorkoutFormModal'
import { WorkoutList } from '../components/workouts/WorkoutList'
import { useDebounce } from '../hooks/useDebounce'
import type { ActivityType, Pagination as PaginationData, Workout } from '../types'

const PAGE_SIZE = 9

interface Result {
  key: string
  workouts: Workout[]
  pagination: PaginationData
}

interface Failure {
  key: string
  message: string
}

// null = closed, 'new' = create form, a Workout = edit form
type FormTarget = 'new' | Workout | null

export default function WorkoutsPage() {
  const [type, setType] = useState<ActivityType | undefined>(undefined)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [failure, setFailure] = useState<Failure | null>(null)
  const [formTarget, setFormTarget] = useState<FormTarget>(null)
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

  const dismissNotice = useCallback(() => setNotice(null), [])

  const search = useDebounce(searchInput.trim(), 400)

  // Identifies one combination of filters, so old answers are never shown for new filters
  const key = `${type ?? 'all'}|${search}|${page}|${reloadCount}`

  useEffect(() => {
    let ignore = false

    workoutService
      .list({ type, search: search || undefined, page, limit: PAGE_SIZE })
      .then((data) => {
        if (!ignore) setResult({ key, ...data })
      })
      .catch((error) => {
        if (!ignore) setFailure({ key, message: getApiError(error).message })
      })

    return () => {
      ignore = true
    }
  }, [key, type, search, page])

  const current = result?.key === key ? result : null
  const currentFailure = failure?.key === key ? failure : null
  const loading = !current && !currentFailure
  const filtering = type !== undefined || search !== ''

  function handleTypeChange(value: ActivityType | undefined) {
    setType(value)
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPage(1)
  }

  function handleSaved(message: string) {
    setFormTarget(null)
    setNotice({ type: 'success', message })
    setReloadCount((count) => count + 1)
  }

  function handleDeleted() {
    setDeleteTarget(null)
    setNotice({ type: 'success', message: 'Workout deleted' })

    // Deleting the only workout of the last page: go back one page
    if (current && current.workouts.length === 1 && page > 1) {
      setPage(page - 1)
    } else {
      setReloadCount((count) => count + 1)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workouts</h1>
          <p className="mt-1 text-slate-600">Your training history.</p>
        </div>
        <Button onClick={() => setFormTarget('new')}>+ New workout</Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <label htmlFor="search" className="sr-only">
            Search workouts
          </label>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="search"
            type="search"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by title..."
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <ActivityFilter value={type} onChange={handleTypeChange} />
      </div>

      {currentFailure && (
        <div className="space-y-3">
          <ErrorMessage message={currentFailure.message} />
          <Button variant="secondary" size="sm" onClick={() => setReloadCount((count) => count + 1)}>
            Try again
          </Button>
        </div>
      )}

      {loading && <LoadingState label="Loading workouts..." />}

      {current && current.workouts.length === 0 && (
        <EmptyState
          title={filtering ? 'No workouts match your filters' : 'No workouts yet'}
          description={
            filtering
              ? 'Try a different search or category.'
              : 'Create your first workout with the New workout button.'
          }
        />
      )}

      {current && current.workouts.length > 0 && (
        <>
          <WorkoutList
            workouts={current.workouts}
            onEdit={(workout) => setFormTarget(workout)}
            onDelete={(workout) => setDeleteTarget(workout)}
          />
          <Pagination
            page={current.pagination.page}
            totalPages={current.pagination.totalPages}
            onChange={setPage}
          />
        </>
      )}

      {formTarget && (
        <WorkoutFormModal
          workout={formTarget === 'new' ? undefined : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmation
          workout={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <Toast notice={notice} onDismiss={dismissNotice} />
    </div>
  )
}