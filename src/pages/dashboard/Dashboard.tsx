

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import Navigation from '@/components/layout/Navigation'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user?.userType === 'teacher') {
      navigate('/teacher/dashboard')
    } else if (user?.userType === 'student') {
      navigate('/student/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LMS Dashboard</h1>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
