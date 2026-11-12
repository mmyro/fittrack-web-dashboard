import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { TOKEN_KEY } from '../api/axios'
import { authService } from '../api/auth.service'
import { renderWithProviders } from '../test/renderWithProviders'
import { ProtectedRoute } from './ProtectedRoute'

vi.mock('../api/auth.service', () => ({
  authService: { me: vi.fn(), login: vi.fn(), register: vi.fn() },
}))

function renderRoutes() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<p>Login page</p>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<p>Private page</p>} />
      </Route>
    </Routes>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.mocked(authService.me).mockReset()
  })

  it('redirects to the login page when there is no session', async () => {
    renderRoutes()

    expect(await screen.findByText('Login page')).toBeInTheDocument()
    expect(authService.me).not.toHaveBeenCalled()
  })

  it('shows the private page when the token is valid', async () => {
    localStorage.setItem(TOKEN_KEY, 'valid-token')
    vi.mocked(authService.me).mockResolvedValue({ id: '1', name: 'Rui', email: 'rui@test.com' })

    renderRoutes()

    expect(await screen.findByText('Private page')).toBeInTheDocument()
  })

  it('redirects to the login page and clears the token when the server answers 401', async () => {
    localStorage.setItem(TOKEN_KEY, 'expired-token')
    vi.mocked(authService.me).mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: 'Invalid or expired token' } },
    })

    renderRoutes()

    expect(await screen.findByText('Login page')).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('keeps the token and offers to try again when the server is unreachable', async () => {
    localStorage.setItem(TOKEN_KEY, 'valid-token')
    vi.mocked(authService.me).mockRejectedValue({ isAxiosError: true })

    renderRoutes()

    expect(await screen.findByText(/Cannot reach the server/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBe('valid-token')
  })
})