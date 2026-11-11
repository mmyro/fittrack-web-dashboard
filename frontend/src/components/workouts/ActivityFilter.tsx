import { getActivityMeta } from '../../config/activityImages'
import { ACTIVITY_TYPES, type ActivityType } from '../../types'

interface ActivityFilterProps {
  value: ActivityType | undefined
  onChange: (value: ActivityType | undefined) => void
}

export function ActivityFilter({ value, onChange }: ActivityFilterProps) {
  const base = 'rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600'

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by activity type">
      <button
        type="button"
        aria-pressed={value === undefined}
        onClick={() => onChange(undefined)}
        className={`${base} ${value === undefined ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'}`}
      >
        All
      </button>

      {ACTIVITY_TYPES.map((type) => {
        const meta = getActivityMeta(type)
        const active = value === type
        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? undefined : type)}
            className={`${base} ${active ? `${meta.badgeClass} ring-2 ring-current` : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'}`}
          >
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}