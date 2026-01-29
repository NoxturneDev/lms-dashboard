

import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { LogOut, Home, BookOpen, FileText } from 'lucide-react'

const Navigation = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            LMS
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to="/courses"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <BookOpen size={20} />
              <span className="hidden sm:inline">Courses</span>
            </Link>

            {user?.userType === 'student' && (
              <Link
                to={`/student/${user.id}/report`}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FileText size={20} />
                <span className="hidden sm:inline">Report Card</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600 capitalize">
                {user?.userType}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
