import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoadingState } from './components/ui/LoadingState'
import { AppLayout } from './components/layout/AppLayout'
import { AuthProvider } from './context/AuthProvider'
import { ProtectedRoute } from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Loaded only when the user opens these pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/workouts" element={<WorkoutsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App