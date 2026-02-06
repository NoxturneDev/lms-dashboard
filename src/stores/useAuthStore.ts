import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axiosClient from '@/api/axiosClient'

export interface User {
  id: string
  email: string
  name: string
  userType: 'teacher' | 'student' | 'admin'
  student_number?: string
  school_id?: string
  school_name?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isLoggedIn: boolean
  loginTeacher: (email: string, password: string) => Promise<void>
  loginStudent: (email: string, password: string) => Promise<void>
  loginAdmin: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isLoggedIn: false,

      loginTeacher: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosClient.post('/auth/teacher/login', {
            email,
            password,
          })
          const { token, user_id, name, userType } = response.data
          const user: User = {
            id: user_id,
            email,
            name,
            userType,
          }
          localStorage.setItem('token', token)
          set({
            user,
            token,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          })
        } catch (err: any) {
          const errorMessage = err.response?.data?.error || 'Login failed'
          set({
            error: errorMessage,
            isLoading: false,
            isLoggedIn: false,
          })
          throw err
        }
      },

      loginStudent: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosClient.post('/auth/student/login', {
            email,
            password,
          })
          const { token, user_id, name, student_number, userType } = response.data
          const user: User = {
            id: user_id,
            email,
            name,
            userType,
            student_number,
          }
          localStorage.setItem('token', token)
          set({
            user,
            token,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          })
        } catch (err: any) {
          const errorMessage = err.response?.data?.error || 'Login failed'
          set({
            error: errorMessage,
            isLoading: false,
            isLoggedIn: false,
          })
          throw err
        }
      },

      loginAdmin: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axiosClient.post('/auth/admin/login', {
            email,
            password,
          })
          const { token, user_id, name, school_id, school_name, userType } = response.data
          const user: User = {
            id: user_id,
            email,
            name,
            userType,
            school_id,
            school_name,
          }
          localStorage.setItem('token', token)
          set({
            user,
            token,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          })
        } catch (err: any) {
          const errorMessage = err.response?.data?.error || 'Login failed'
          set({
            error: errorMessage,
            isLoading: false,
            isLoggedIn: false,
          })
          throw err
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
)
