import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatWeekLabel } from '../../utils/format'
import type { WorkoutStats } from '../../types'

interface WeeklyChartProps {
  weekly: WorkoutStats['weekly']
}

export function WeeklyChart({ weekly }: WeeklyChartProps) {
  const data = weekly.map((week) => ({
    week: formatWeekLabel(week.weekStart),
    minutes: week.minutes,
  }))

  const totalMinutes = weekly.reduce((sum, week) => sum + week.minutes, 0)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Weekly activity</h2>
      <p className="text-sm text-slate-500">Minutes trained per week, last 8 weeks</p>

      {totalMinutes === 0 ? (
        <p className="py-16 text-center text-slate-500">No workouts in the last 8 weeks.</p>
      ) : (
        <div className="mt-4 h-64" role="img" aria-label="Bar chart of minutes trained per week">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="minutes" name="Minutes" fill="#047857" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}