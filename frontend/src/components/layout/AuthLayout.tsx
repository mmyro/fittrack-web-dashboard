import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <span className="font-heading text-2xl font-bold">
          Fit<span className="text-lime-400">Track</span>
        </span>
        <div>
          <h2 className="font-heading text-4xl font-bold leading-tight">
            Track every workout.
            <br />
            See your progress.
          </h2>
          <p className="mt-4 max-w-md text-slate-300">
            Log your training, review your history and follow your stats in one simple dashboard.
          </p>
        </div>
        <p className="text-sm text-slate-400">FitTrack Web Dashboard</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <span className="mb-8 block font-heading text-2xl font-bold text-slate-900 lg:hidden">
            Fit<span className="text-emerald-700">Track</span>
          </span>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}