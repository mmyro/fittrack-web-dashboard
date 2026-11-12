import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { useAuth } from '../context/useAuth'

export function ProtectedRoute() {
  const { user, loading, sessionError, retrySession } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  // The server could not be reached: keep the session and let the user retry
  if (sessionError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <ErrorMessage message={sessionError} />
        <Button variant="secondary" onClick={retrySession}>
          Try again
        </Button>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}