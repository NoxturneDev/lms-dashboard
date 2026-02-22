import React from "react"
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'teacher' | 'student' | 'admin'
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isLoggedIn, user } = useAuthStore()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.userType !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
