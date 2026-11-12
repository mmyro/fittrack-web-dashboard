import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'

interface Options {
  route?: string
}

// Draws a component inside the router and the auth context, like in the real app
export function renderWithProviders(ui: ReactElement, { route = '/' }: Options = {}) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthProvider>,
  )
}