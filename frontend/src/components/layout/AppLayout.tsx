import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { Button } from '../ui/Button'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/workouts', label: 'Workouts', end: false },
]

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-slate-900 p-6 text-white lg:flex">
        <div>
          <span className="font-heading text-2xl font-bold">
            Fit<span className="text-lime-400">Track</span>
          </span>
          <nav className="mt-10 flex flex-col gap-1" aria-label="Main">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 font-medium transition ${
                    isActive ? 'bg-emerald-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="truncate text-sm text-slate-400">{user?.email}</p>
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1">
        {/* Top bar (mobile and tablet) */}
        <header className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-heading text-xl font-bold text-slate-900">
              Fit<span className="text-emerald-700">Track</span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
          <nav className="mt-3 flex gap-2" aria-label="Main">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-1.5 text-sm font-medium ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}