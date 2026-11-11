interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent"
        aria-hidden="true"
      />
      {label}
    </div>
  )
}