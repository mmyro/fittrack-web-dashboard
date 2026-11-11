import axios from 'axios'

export interface FieldError {
  field: string
  message: string
}

export interface ApiErrorInfo {
  message: string
  errors: FieldError[]
}

// Converts any error into something the UI can show
export function getApiError(error: unknown): ApiErrorInfo {
  if (axios.isAxiosError<{ message?: string; errors?: FieldError[] }>(error)) {
    if (error.response?.data?.message) {
      return {
        message: error.response.data.message,
        errors: error.response.data.errors ?? [],
      }
    }
    if (!error.response) {
      return { message: 'Cannot reach the server. Please try again later.', errors: [] }
    }
  }
  return { message: 'Something went wrong. Please try again.', errors: [] }
}