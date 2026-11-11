import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getApiError } from '../api/errors'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { TextField } from '../components/ui/TextField'
import { useAuth } from '../context/useAuth'
import { toFieldErrors, validateRegister, type FieldErrors } from '../utils/validation'

export default function RegisterPage() {
  const { user, register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const errors = validateRegister(name, email, password, confirmPassword)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await register(name.trim(), email.trim(), password)
    } catch (error) {
      const info = getApiError(error)
      setFormError(info.message)
      setFieldErrors(toFieldErrors(info.errors))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start tracking your workouts today.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <ErrorMessage message={formError} />}

        <TextField
          label="Name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-emerald-700 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}