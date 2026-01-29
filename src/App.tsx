import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { AppRouter } from '@/router'

function App() {
  const { token } = useAuthStore()

  useEffect(() => {
    // Restore token from localStorage if it exists
    const storedToken = localStorage.getItem('token')
    if (storedToken && !token) {
      // Token is managed by Zustand persist middleware
    }
  }, [token])

  return <AppRouter />
}

export default App
