import axios from 'axios'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { TOKEN_KEY } from '../api/axios'
import { authService } from '../api/auth.service'
import { getApiError } from '../api/errors'
import { AuthContext } from './AuthContext'
import type { User } from '../types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Only "loading" if there is a saved token to check
  const [loading, setLoading] = useState<boolean>(() => localStorage.getItem(TOKEN_KEY) !== null)
  const [sessionError, setSessionError] = useState('')
  const [attempt, setAttempt] = useState(0)

  // Restore the session when the app loads
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return

    let ignore = false

    authService
      .me()
      .then((currentUser) => {
        if (ignore) return
        setUser(currentUser)
        setSessionError('')
      })
      .catch((error) => {
        if (ignore) return
        // Only an invalid token ends the session. If the server is unreachable
        // the token is kept, so the user can try again without logging in
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
        } else {
          setSessionError(getApiError(error).message)
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [attempt])

  // The Axios interceptor fires this event when the server answers 401
  useEffect(() => {
    const handleLogout = () => setUser(null)
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const retrySession = useCallback(() => {
    setSessionError('')
    setLoading(true)
    setAttempt((count) => count + 1)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login(email, password)
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await authService.register({ name, email, password })
      await login(email, password)
    },
    [login],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, sessionError, retrySession, login, register, logout }),
    [user, loading, sessionError, retrySession, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}