import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiError } from '../api/errors'
import { workoutService } from '../api/workout.service'
import { ActivityDistribution } from '../components/dashboard/ActivityDistribution'
import { StatisticsCard } from '../components/dashboard/StatisticsCard'
import { WeeklyChart } from '../components/dashboard/WeeklyChart'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { ActivityIcon, ClockIcon, FlameIcon } from '../components/ui/Icons'
import { LoadingState } from '../components/ui/LoadingState'
import { Toast, type Notice } from '../components/ui/Toast'
import { WorkoutCard } from '../components/workouts/WorkoutCard'
import { WorkoutFormModal } from '../components/workouts/WorkoutFormModal'
import { useAuth } from '../context/useAuth'
import { getActivityMeta } from '../config/activityImages'
import { formatDuration, formatNumber } from '../utils/format'
import type { Workout, WorkoutStats } from '../types'

interface DashboardData {
  stats: WorkoutStats
  recent: Workout[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const dismissNotice = useCallback(() => setNotice(null), [])

  useEffect(() => {
    let ignore = false

    Promise.all([workoutService.stats(), workoutService.list({ page: 1, limit: 3 })])
      .then(([stats, list]) => {
        if (ignore) return
        setData({ stats, recent: list.workouts })
        setError('')
      })
      .catch((err) => {
        if (!ignore) setError(getApiError(err).message)
      })

    return () => {
      ignore = true
    }
  }, [reloadCount])

  function handleSaved(message: string) {
    setCreating(false)
    setNotice({ type: 'success', message })
    setReloadCount((count) => count + 1)
  }

  function retry() {
    setError('')
    setReloadCount((count) => count + 1)
  }

  const firstName = user?.name.split(' ')[0] ?? ''
  const loading = !data && !error

  // The category with the most workouts, shown as a hint under the total
  const topType = data?.stats.byType.reduce((best, item) => (item.count > best.count ? item : best))
  const topHint =
    topType && topType.count > 0 ? `Most frequent: ${getActivityMeta(topType.activityType).label}` : undefined

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hello, {firstName}</h1>
          <p className="mt-1 text-slate-600">Here is a summary of your training.</p>
        </div>
        <Button onClick={() => setCreating(true)}>+ New workout</Button>
      </div>

      {error && (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button variant="secondary" size="sm" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      {loading && <LoadingState label="Loading your dashboard..." />}

      {data && !error && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatisticsCard
              label="Total workouts"
              value={formatNumber(data.stats.totalWorkouts)}
              hint={topHint}
              icon={<ActivityIcon className="h-6 w-6" />}
              iconClass="bg-emerald-100 text-emerald-700"
            />
            <StatisticsCard
              label="Calories burned"
              value={`${formatNumber(data.stats.totalCalories)} kcal`}
              icon={<FlameIcon className="h-6 w-6" />}
              iconClass="bg-orange-100 text-orange-600"
            />
            <StatisticsCard
              label="Time trained"
              value={formatDuration(data.stats.totalMinutes)}
              hint={`${formatNumber(data.stats.totalMinutes)} minutes in total`}
              icon={<ClockIcon className="h-6 w-6" />}
              iconClass="bg-indigo-100 text-indigo-700"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeeklyChart weekly={data.stats.weekly} />
            </div>
            <ActivityDistribution byType={data.stats.byType} />
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent workouts</h2>
              <Link to="/workouts" className="text-sm font-medium text-emerald-700 hover:underline">
                View all
              </Link>
            </div>

            {data.recent.length === 0 ? (
              <EmptyState
                title="No workouts yet"
                description="Create your first workout with the New workout button."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.recent.map((workout) => (
                  <WorkoutCard key={workout._id} workout={workout} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {creating && <WorkoutFormModal onClose={() => setCreating(false)} onSaved={handleSaved} />}

      <Toast notice={notice} onDismiss={dismissNotice} />
    </div>
  )
}