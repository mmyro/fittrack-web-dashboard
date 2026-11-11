import { api } from './axios'
import type { User } from '../types'

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export const authService = {
  register: (data: RegisterInput) =>
    api.post<{ user: User }>('/auth/register', data).then((response) => response.data),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then((response) => response.data),

  me: () => api.get<{ user: User }>('/auth/me').then((response) => response.data.user),
}