import { useEffect } from 'react'

export interface Notice {
  type: 'success' | 'error'
  message: string
}

interface ToastProps {
  notice: Notice | null
  onDismiss: () => void
}

export function Toast({ notice, onDismiss }: ToastProps) {
  // The message disappears by itself after 4 seconds
  useEffect(() => {
    if (!notice) return
    const id = setTimeout(onDismiss, 4000)
    return () => clearTimeout(id)
  }, [notice, onDismiss])

  if (!notice) return null

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
        notice.type === 'success' ? 'bg-emerald-700' : 'bg-red-600'
      }`}
    >
      {notice.message}
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="text-lg leading-none">
        &times;
      </button>
    </div>
  )
}