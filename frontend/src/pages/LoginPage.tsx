import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { getApiError } from '../api/errors'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { TextField } from '../components/ui/TextField'
import { useAuth } from '../context/useAuth'
import { toFieldErrors, validateLogin, type FieldErrors } from '../utils/validation'

export default function LoginPage() {
  const { user, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Where the user was trying to go before being sent to the login
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  if (user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const errors = validateLogin(email, password)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (error) {
      const info = getApiError(error)
      setFormError(info.message)
      setFieldErrors(toFieldErrors(info.errors))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see your workouts.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <ErrorMessage message={formError} />}

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-emerald-700 hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}