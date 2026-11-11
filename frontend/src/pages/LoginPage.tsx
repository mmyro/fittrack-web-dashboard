import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getApiError } from '../api/errors'
import { useAuth } from '../context/useAuth'

// TEMPORARY page, replaced by the real login form in the next step
export default function LoginPage() {
  const { user, login } = useAuth()
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleClick() {
    try {
      await login('rui@test.com', '12345678')
    } catch (err) {
      setError(getApiError(err).message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-emerald-700">Login (temporary)</h1>
      <button
        onClick={handleClick}
        className="rounded-xl bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800"
      >
        Login as Rui
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  )
}