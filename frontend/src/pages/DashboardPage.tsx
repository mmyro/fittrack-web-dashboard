import { useAuth } from '../context/useAuth'

// TEMPORARY, the real dashboard comes later
export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Hello, {user?.name}</h1>
      <p className="mt-2 text-slate-600">Your dashboard is coming soon.</p>
    </div>
  )
}