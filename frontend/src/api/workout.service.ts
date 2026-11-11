import { api } from './axios'
import type { ActivityType, Pagination, Workout, WorkoutInput, WorkoutStats } from '../types'

export interface ListParams {
  type?: ActivityType
  search?: string
  page?: number
  limit?: number
}

export const workoutService = {
  list: (params: ListParams) =>
    api
      .get<{ workouts: Workout[]; pagination: Pagination }>('/workouts', { params })
      .then((response) => response.data),

  create: (data: WorkoutInput) =>
    api.post<{ workout: Workout }>('/workouts', data).then((response) => response.data.workout),

  update: (id: string, data: WorkoutInput) =>
    api.put<{ workout: Workout }>(`/workouts/${id}`, data).then((response) => response.data.workout),

  remove: (id: string) => api.delete(`/workouts/${id}`),

  stats: () => api.get<WorkoutStats>('/workouts/stats').then((response) => response.data),
}