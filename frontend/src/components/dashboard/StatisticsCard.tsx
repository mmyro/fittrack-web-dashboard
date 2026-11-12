import type { ReactNode } from 'react'

interface StatisticsCardProps {
  label: string
  value: string
  hint?: string
  icon: ReactNode
  iconClass: string
}

export function StatisticsCard({ label, value, hint, icon, iconClass }: StatisticsCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-heading text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="truncate text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  )
}