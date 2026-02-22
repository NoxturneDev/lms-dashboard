import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { Building2, Users, GraduationCap, School, Shield, LogOut, LayoutDashboard } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/schools', label: 'Schools', icon: Building2 },
    { path: '/admin/classes', label: 'Classes', icon: School },
    { path: '/admin/teachers', label: 'Teachers', icon: Users },
    { path: '/admin/students', label: 'Students', icon: GraduationCap },
    { path: '/admin/admins', label: 'Admins', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Shield size={28} />
            <div>
              <h1 className="text-lg font-bold">Admin Portal</h1>
              <p className="text-xs text-gray-400">{user?.school_name || 'LMS Admin'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="mb-3 px-4">
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
