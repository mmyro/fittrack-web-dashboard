import { useEffect, useState } from 'react'
import { getApiError } from '../api/errors'
import { workoutService } from '../api/workout.service'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { SearchIcon } from '../components/ui/Icons'
import { LoadingState } from '../components/ui/LoadingState'
import { Pagination } from '../components/ui/Pagination'
import { ActivityFilter } from '../components/workouts/ActivityFilter'
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

export default function WorkoutsPage() {
  const [type, setType] = useState<ActivityType | undefined>(undefined)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [failure, setFailure] = useState<Failure | null>(null)

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Workouts</h1>
        <p className="mt-1 text-slate-600">Your training history.</p>
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
            filtering ? 'Try a different search or category.' : 'Your logged workouts will appear here.'
          }
        />
      )}

      {current && current.workouts.length > 0 && (
        <>
          <WorkoutList workouts={current.workouts} />
          <Pagination
            page={current.pagination.page}
            totalPages={current.pagination.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  )
}