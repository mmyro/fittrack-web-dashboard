import { useEffect, useState } from 'react'
import { api } from './api/axios'
import { getApiError } from './api/errors'

function App() {
  const [status, setStatus] = useState('Checking API...')

  useEffect(() => {
    api
      .get('/health')
      .then((response) => setStatus(`API status: ${response.data.status}`))
      .catch((error) => setStatus(getApiError(error).message))
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-4xl font-bold text-emerald-700">FitTrack Web Dashboard</h1>
      <p className="text-slate-600">{status}</p>
    </div>
  )
}

export default App