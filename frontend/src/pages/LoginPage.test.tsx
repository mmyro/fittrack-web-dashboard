import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { TOKEN_KEY } from '../api/axios'
import { authService } from '../api/auth.service'
import { renderWithProviders } from '../test/renderWithProviders'
import LoginPage from './LoginPage'

vi.mock('../api/auth.service', () => ({
  authService: { me: vi.fn(), login: vi.fn(), register: vi.fn() },
}))

function renderLogin() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<p>Dashboard page</p>} />
    </Routes>,
    { route: '/login' },
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(authService.login).mockReset()
  })

  it('shows validation errors and does not call the API when the form is empty', async () => {
    renderLogin()

    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(authService.login).not.toHaveBeenCalled()
  })

  it('shows the API error when the credentials are wrong', async () => {
    vi.mocked(authService.login).mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: 'Invalid email or password', errors: [] } },
    })
    renderLogin()

    await userEvent.type(screen.getByLabelText('Email'), 'rui@test.com')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
  })

  it('stores the token and goes to the dashboard when the login succeeds', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      token: 'new-token',
      user: { id: '1', name: 'Rui', email: 'rui@test.com' },
    })
    renderLogin()

    await userEvent.type(screen.getByLabelText('Email'), 'rui@test.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token')
    expect(authService.login).toHaveBeenCalledWith('rui@test.com', 'secret123')
  })
})