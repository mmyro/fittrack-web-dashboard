import { FALLBACK_IMAGE } from '../../config/activityImages'

interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <img src={FALLBACK_IMAGE} alt="" className="mx-auto mb-5 w-48 rounded-2xl" />
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-slate-600">{description}</p>}
    </div>
  )
}