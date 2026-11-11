import { useAuth } from '../context/useAuth'

// TEMPORARY page, the real dashboard comes later
export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-emerald-700">Hello, {user?.name}</h1>
      <p className="text-slate-600">{user?.email}</p>
      <button
        onClick={logout}
        className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
      >
        Logout
      </button>
    </div>
  )
}