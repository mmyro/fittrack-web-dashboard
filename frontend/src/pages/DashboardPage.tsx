import { ActivityImage } from '../components/workouts/ActivityImage'
import { getActivityMeta } from '../config/activityImages'
import { useAuth } from '../context/useAuth'
import { ACTIVITY_TYPES } from '../types'

// TEMPORARY page, the real dashboard comes later
export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-700">Hello, {user?.name}</h1>
        <button
          onClick={logout}
          className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...ACTIVITY_TYPES, 'Unknown'].map((type) => (
          <div key={type} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ActivityImage type={type} />
            <div className="p-4">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getActivityMeta(type).badgeClass}`}>
                {type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}