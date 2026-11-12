import { getActivityMeta } from '../../config/activityImages'
import type { WorkoutStats } from '../../types'

interface ActivityDistributionProps {
  byType: WorkoutStats['byType']
}

export function ActivityDistribution({ byType }: ActivityDistributionProps) {
  const total = byType.reduce((sum, item) => sum + item.count, 0)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">By category</h2>
      <p className="text-sm text-slate-500">Share of your workouts</p>

      <ul className="mt-5 space-y-4">
        {byType.map((item) => {
          const meta = getActivityMeta(item.activityType)
          const percentage = total === 0 ? 0 : Math.round((item.count / total) * 100)

          return (
            <li key={item.activityType}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{meta.label}</span>
                <span className="text-slate-500">
                  {item.count} ({percentage}%)
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: meta.color }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}